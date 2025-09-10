import { NextRequest, NextResponse } from 'next/server';
import { getProjectsFromEdgeConfig, updateProjectsInEdgeConfig } from '@/lib/edgeConfig';
import { PixelArtProject, EdgeConfigProjects } from '@/types/pixelArt';

// Handler for GET requests to /api/project
// Used to retrieve all projects for a given username.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    const allProjects = await getProjectsFromEdgeConfig();
    const userProjects = allProjects[username] || [];
    return NextResponse.json(userProjects, { status: 200 });
  } catch (error) {
    console.error('API GET /api/project error:', error);
    return NextResponse.json({ error: 'Failed to retrieve projects' }, { status: 500 });
  }
}

// Handler for POST requests to /api/project
// Used to save or update a pixel art project.
export async function POST(req: NextRequest) {
  try {
    const newProject: PixelArtProject = await req.json();

    if (!newProject.username || !newProject.id || !newProject.name || !newProject.pixels || newProject.size === undefined) {
      return NextResponse.json({ error: 'Missing required project fields' }, { status: 400 });
    }

    const allProjects = await getProjectsFromEdgeConfig();
    const userProjects = allProjects[newProject.username] || [];

    // Check if project exists and update, otherwise add new
    const existingProjectIndex = userProjects.findIndex(p => p.id === newProject.id);
    if (existingProjectIndex > -1) {
      userProjects[existingProjectIndex] = newProject;
    } else {
      userProjects.push(newProject);
    }

    allProjects[newProject.username] = userProjects;

    // In a real scenario, this would update a database. For Edge Config, we are simulating.
    // As noted in src/lib/edgeConfig.ts, direct writes to Edge Config from serverless functions
    // are not typical for user data and would require Vercel API tokens, etc.
    const updateSuccess = await updateProjectsInEdgeConfig(allProjects);

    if (updateSuccess) {
      return NextResponse.json({ message: 'Project saved successfully', projectId: newProject.id }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Failed to update projects in Edge Config' }, { status: 500 });
    }
  } catch (error) {
    console.error('API POST /api/project error:', error);
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}
