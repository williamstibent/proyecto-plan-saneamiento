import { apiClient } from '@/shared/lib/api'
import type { LoginRequest, LoginResponse } from '../types'

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials)
  return data
}
