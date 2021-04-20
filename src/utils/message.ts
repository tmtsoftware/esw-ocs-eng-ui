import { message } from 'antd'
import type { MessageType } from 'antd/lib/message'

// One place to modify configurations of success and error messages
// For example, if we decide to change defaults like duration to show message

export const successMessage = (msg: string): MessageType => message.success(msg)

export const errorMessage = (msg: string, reason?: unknown): MessageType =>
  reason
    ? message.error(`${msg}, reason: ${(reason as Error).message}`)
    : message.error(msg)
