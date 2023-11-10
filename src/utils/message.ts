import { message } from 'antd'
import { MessageType } from 'antd/lib/message/interface'

// One place to modify configurations of success and error messages
// For example, if we decide to change defaults like duration to show message

export const _createErrorMsg = (msg: string, reason: string): string => `${msg}, reason: ${reason}`

export const successMessage = (msg: string): MessageType => message.success(msg)

export const errorMessage = (msg: string, reason?: unknown): MessageType =>
  reason ? message.error(_createErrorMsg(msg, (reason as Error).message)) : message.error(msg)
