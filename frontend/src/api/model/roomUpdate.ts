/**
 * Generated by orval v6.27.1 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import type { RoomUpdateIsPublished } from './roomUpdateIsPublished';
import type { RoomUpdateIsRandomized } from './roomUpdateIsRandomized';
import type { RoomUpdateName } from './roomUpdateName';

export interface RoomUpdate {
  is_published: RoomUpdateIsPublished;
  is_randomized: RoomUpdateIsRandomized;
  name: RoomUpdateName;
}