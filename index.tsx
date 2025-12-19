import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create storage bucket on startup for photo uploads
const bucketName = 'make-f835a0b6-photos';
(async () => {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: false });
    console.log(`Created storage bucket: ${bucketName}`);
  }
})();

// Helper function to verify user
async function verifyUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { error: 'No token provided', userId: null };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return { error: 'Unauthorized', userId: null };
  }
  
  return { error: null, userId: user.id };
}

// Routes

// Signup route
app.post('/make-server-f835a0b6/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Validate role
    const validRoles = ['family', 'resident', 'staff', 'admin'];
    if (!validRoles.includes(role)) {
      return c.json({ error: 'Invalid role' }, 400);
    }

    // Create user in Supabase
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true, // Auto-confirm email since email server not configured
    });

    if (error) {
      console.error('Signup error from Supabase:', error);
      
      // Handle specific error cases
      if (error.message.includes('already been registered') || error.code === 'email_exists') {
        return c.json({ error: 'An account with this email already exists. Please use a different email or sign in.' }, 409);
      }
      
      return c.json({ error: error.message }, 400);
    }

    // Store user role in KV store
    await kv.set(`user:${data.user.id}:role`, role);
    await kv.set(`user:${data.user.id}:profile`, JSON.stringify({
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    }));

    return c.json({ success: true, userId: data.user.id });
  } catch (error: any) {
    console.error('Signup route error:', error);
    return c.json({ error: error.message || 'Signup failed' }, 500);
  }
});

// Get user role
app.get('/make-server-f835a0b6/user/role', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const role = await kv.get(`user:${userId}:role`);
    if (!role) {
      return c.json({ error: 'Role not found' }, 404);
    }

    return c.json({ role });
  } catch (error: any) {
    console.error('Get role error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get user profile
app.get('/make-server-f835a0b6/user/profile', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const profileStr = await kv.get(`user:${userId}:profile`);
    if (!profileStr) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profile = JSON.parse(profileStr);
    return c.json({ profile });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Family Dashboard APIs

// Get resident info (for family)
app.get('/make-server-f835a0b6/family/resident/:residentId', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  const residentId = c.req.param('residentId');
  
  try {
    const residentStr = await kv.get(`resident:${residentId}`);
    if (!residentStr) {
      return c.json({ error: 'Resident not found' }, 404);
    }

    return c.json({ resident: JSON.parse(residentStr) });
  } catch (error: any) {
    console.error('Get resident error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get daily care log
app.get('/make-server-f835a0b6/family/care-log/:residentId', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  const residentId = c.req.param('residentId');
  const date = c.req.query('date') || new Date().toISOString().split('T')[0];

  try {
    const logStr = await kv.get(`care-log:${residentId}:${date}`);
    if (!logStr) {
      return c.json({ careLog: null });
    }

    return c.json({ careLog: JSON.parse(logStr) });
  } catch (error: any) {
    console.error('Get care log error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Staff Dashboard APIs

// Get assigned tasks
app.get('/make-server-f835a0b6/staff/tasks', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const tasksData = await kv.getByPrefix(`staff:${userId}:task:`);
    const tasks = tasksData.map((task: any) => JSON.parse(task));
    return c.json({ tasks });
  } catch (error: any) {
    console.error('Get tasks error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Complete task
app.post('/make-server-f835a0b6/staff/task/:taskId/complete', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  const taskId = c.req.param('taskId');

  try {
    const taskStr = await kv.get(`staff:${userId}:task:${taskId}`);
    if (!taskStr) {
      return c.json({ error: 'Task not found' }, 404);
    }

    const task = JSON.parse(taskStr);
    task.completed = true;
    task.completedAt = new Date().toISOString();

    await kv.set(`staff:${userId}:task:${taskId}`, JSON.stringify(task));

    return c.json({ success: true, task });
  } catch (error: any) {
    console.error('Complete task error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Report incident
app.post('/make-server-f835a0b6/staff/incident', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const body = await c.req.json();
    const { residentId, type, description, severity } = body;

    const incidentId = crypto.randomUUID();
    const incident = {
      id: incidentId,
      residentId,
      reportedBy: userId,
      type,
      description,
      severity,
      createdAt: new Date().toISOString(),
      status: 'open',
    };

    await kv.set(`incident:${incidentId}`, JSON.stringify(incident));

    return c.json({ success: true, incident });
  } catch (error: any) {
    console.error('Report incident error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Admin Dashboard APIs

// Get all residents
app.get('/make-server-f835a0b6/admin/residents', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const residentsData = await kv.getByPrefix('resident:');
    const residents = residentsData.map((resident: any) => JSON.parse(resident));
    return c.json({ residents });
  } catch (error: any) {
    console.error('Get residents error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get all incidents
app.get('/make-server-f835a0b6/admin/incidents', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const incidentsData = await kv.getByPrefix('incident:');
    const incidents = incidentsData.map((incident: any) => JSON.parse(incident));
    return c.json({ incidents });
  } catch (error: any) {
    console.error('Get incidents error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Resident Dashboard APIs

// Get resident's own info
app.get('/make-server-f835a0b6/resident/info', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const residentStr = await kv.get(`user:${userId}:resident-profile`);
    if (!residentStr) {
      return c.json({ error: 'Resident profile not found' }, 404);
    }

    return c.json({ resident: JSON.parse(residentStr) });
  } catch (error: any) {
    console.error('Get resident info error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Request help (SOS)
app.post('/make-server-f835a0b6/resident/sos', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const body = await c.req.json();
    const { message, type } = body;

    const sosId = crypto.randomUUID();
    const sos = {
      id: sosId,
      residentId: userId,
      message,
      type,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    await kv.set(`sos:${sosId}`, JSON.stringify(sos));

    return c.json({ success: true, sos });
  } catch (error: any) {
    console.error('SOS request error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get activities
app.get('/make-server-f835a0b6/activities', async (c) => {
  try {
    const activitiesData = await kv.getByPrefix('activity:');
    const activities = activitiesData.map((activity: any) => JSON.parse(activity));
    return c.json({ activities });
  } catch (error: any) {
    console.error('Get activities error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Book activity
app.post('/make-server-f835a0b6/resident/book-activity', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const body = await c.req.json();
    const { activityId } = body;

    const bookingId = crypto.randomUUID();
    const booking = {
      id: bookingId,
      activityId,
      residentId: userId,
      bookedAt: new Date().toISOString(),
      status: 'confirmed',
    };

    await kv.set(`booking:${bookingId}`, JSON.stringify(booking));

    return c.json({ success: true, booking });
  } catch (error: any) {
    console.error('Book activity error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Photo Upload APIs

// Upload photo
app.post('/make-server-f835a0b6/photos/upload', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const body = await c.req.json();
    const { imageData, message, residentId } = body;

    if (!imageData || !message) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Extract base64 data
    const base64Data = imageData.split(',')[1];
    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Generate unique filename
    const photoId = crypto.randomUUID();
    const filename = `${photoId}.jpg`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('Photo upload error to storage:', uploadError);
      return c.json({ error: 'Failed to upload photo' }, 500);
    }

    // Get user profile to get name
    const profileStr = await kv.get(`user:${userId}:profile`);
    const profile = profileStr ? JSON.parse(profileStr) : { name: 'Staff Member' };

    // Create signed URL (valid for 1 year)
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filename, 31536000);

    // Save photo metadata
    const photoMetadata = {
      id: photoId,
      imageUrl: signedUrlData?.signedUrl || '',
      message,
      timestamp: new Date().toISOString(),
      uploadedBy: profile.name,
      uploadedById: userId,
      residentId: residentId || 'default-resident',
    };

    await kv.set(`photo:${photoId}`, JSON.stringify(photoMetadata));

    return c.json({ success: true, photo: photoMetadata });
  } catch (error: any) {
    console.error('Photo upload route error:', error);
    return c.json({ error: error.message || 'Photo upload failed' }, 500);
  }
});

// Get all photos
app.get('/make-server-f835a0b6/photos', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const photosData = await kv.getByPrefix('photo:');
    const photos = photosData.map((photo: any) => JSON.parse(photo));
    // Sort by timestamp descending
    photos.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return c.json({ photos });
  } catch (error: any) {
    console.error('Get photos error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Daily Care Log APIs

// Update daily care log
app.post('/make-server-f835a0b6/care-log/update', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const body = await c.req.json();
    const { residentId, date, updates } = body;

    if (!residentId || !date || !updates) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const logKey = `care-log:${residentId}:${date}`;
    
    // Get existing log or create new one
    let careLog: any = {};
    const existingLogStr = await kv.get(logKey);
    if (existingLogStr) {
      careLog = JSON.parse(existingLogStr);
    }

    // Merge updates
    careLog = { ...careLog, ...updates, lastUpdated: new Date().toISOString() };

    await kv.set(logKey, JSON.stringify(careLog));

    return c.json({ success: true, careLog });
  } catch (error: any) {
    console.error('Update care log error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get care log for a specific date
app.get('/make-server-f835a0b6/care-log/:residentId/:date', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  const residentId = c.req.param('residentId');
  const date = c.req.param('date');

  try {
    const logStr = await kv.get(`care-log:${residentId}:${date}`);
    if (!logStr) {
      // Return default structure if no log exists
      return c.json({ 
        careLog: {
          meals: {
            breakfast: { taken: false, time: '', items: '' },
            lunch: { taken: false, time: '', items: '' },
            dinner: { taken: false, time: '', items: '' },
          },
          medications: [],
          vitals: {},
          activities: [],
          notes: '',
        }
      });
    }

    return c.json({ careLog: JSON.parse(logStr) });
  } catch (error: any) {
    console.error('Get care log error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Task Management APIs

// Create task
app.post('/make-server-f835a0b6/tasks/create', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const body = await c.req.json();
    const { staffId, type, resident, room, task, time } = body;

    const taskId = crypto.randomUUID();
    const newTask = {
      id: taskId,
      type,
      resident,
      room,
      task,
      time,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`staff:${staffId}:task:${taskId}`, JSON.stringify(newTask));

    return c.json({ success: true, task: newTask });
  } catch (error: any) {
    console.error('Create task error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update task status
app.post('/make-server-f835a0b6/tasks/:taskId/update', async (c) => {
  const { error, userId } = await verifyUser(c.req.raw);
  if (error) {
    return c.json({ error }, 401);
  }

  const taskId = c.req.param('taskId');

  try {
    const body = await c.req.json();
    const { status } = body;

    // Find the task
    const tasksData = await kv.getByPrefix(`staff:${userId}:task:`);
    let taskFound = false;

    for (const taskStr of tasksData) {
      const task = JSON.parse(taskStr);
      if (task.id === taskId) {
        task.status = status;
        if (status === 'completed') {
          task.completedAt = new Date().toISOString();
        }
        await kv.set(`staff:${userId}:task:${taskId}`, JSON.stringify(task));
        taskFound = true;
        return c.json({ success: true, task });
      }
    }

    if (!taskFound) {
      return c.json({ error: 'Task not found' }, 404);
    }
  } catch (error: any) {
    console.error('Update task error:', error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);