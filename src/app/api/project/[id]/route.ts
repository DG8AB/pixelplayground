import { NextRequest, NextResponse } from 'next/server';
import { getProjectsFromEdgeConfig } from '@/lib/edgeConfig';
import { PixelArtProject } from '@/types/pixelArt';

// Handler for GET requests to /api/project/[id]
// Used to retrieve a single project for public viewing (shareable link).
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id;

  try {
    const allProjectsByUsername = await getProjectsFromEdgeConfig();
    let foundProject: PixelArtProject | undefined;

    // Iterate through all usernames to find the project by ID
    for (const username in allProjectsByUsername) {
      if (Object.prototype.hasOwnProperty.call(allProjectsByUsername, username)) {
        const userProjects = allProjectsByUsername[username];
        foundProject = userProjects.find(p => p.id === projectId);
        if (foundProject) {
          break;
        }
      }
    }

    if (!foundProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(foundProject, { status: 200 });
  } catch (error) {
    console.error(`API GET /api/project/${projectId} error:`, error);
    return NextResponse.json({ error: 'Failed to retrieve project' }, { status: 500 });
  }
}
