/**
 * Generated by orval v6.27.1 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import type { StudentCreatedAt } from './studentCreatedAt';
import type { StudentRoomId } from './studentRoomId';

export interface Student {
  created_at?: StudentCreatedAt;
  id?: number;
  name: string;
  room_id?: StudentRoomId;
}