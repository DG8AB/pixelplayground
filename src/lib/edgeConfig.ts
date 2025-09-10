import { get } from '@vercel/edge-config';
import { EdgeConfigProjects, PixelArtProject } from '@/types/pixelArt';

// This is a simplified model for demonstration. 
// In a real application, Edge Config is primarily for READ-ONLY configuration.
// Storing frequently changing user data here (especially with writes) is not recommended 
// and would be better suited for a dedicated database (e.g., Vercel Postgres, MongoDB).
// Edge Config updates are not immediate and have rate limits.

const EDGE_CONFIG_PROJECTS_KEY = 'pixelProjects';

export async function getProjectsFromEdgeConfig(): Promise<EdgeConfigProjects> {
  try {
    const data = await get<string>(EDGE_CONFIG_PROJECTS_KEY);
    if (typeof data === 'string') {
      return JSON.parse(data);
    } else if (data === undefined) {
      console.log('Edge Config key not found, returning empty object.');
      return {};
    } else {
      console.error('Unexpected data type from Edge Config:', data);
      return {};
    }
  } catch (error) {
    console.error('Failed to retrieve projects from Edge Config:', error);
    return {};
  }
}

// NOTE: This write function is for demonstration and not how Edge Config is typically used for user data.
// Edge Config does not expose a public API for direct write operations from serverless functions.
// Updates are usually done via Vercel CLI, Dashboard, or API (with specific tokens).
// For this example, it's simulated as if it could be updated.
export async function updateProjectsInEdgeConfig(newProjects: EdgeConfigProjects): Promise<boolean> {
  console.warn("Attempting to write to Edge Config. This is a simulation for demonstration purposes.");
  console.warn("Edge Config is primarily for read-only data. Direct writes from serverless functions are not standard.");
  // In a real scenario, you'd likely update a separate database and maybe invalidate/refresh Edge Config if it cached derived data.
  // For this demo, we'll just log and pretend it worked, or you'd need a Vercel API token with write access.
  // A real implementation would involve Vercel's API:
  // const response = await fetch(`https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items/${EDGE_CONFIG_PROJECTS_KEY}`, {
  //   method: 'PATCH',
  //   headers: {
  //     Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ data: { [EDGE_CONFIG_PROJECTS_KEY]: JSON.stringify(newProjects) } }),
  // });
  // if (!response.ok) { console.error('Failed to update Edge Config:', await response.text()); return false; }
  
  // For now, we simulate success for local development and conceptual understanding.
  return true;
}

