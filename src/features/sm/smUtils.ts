import type { RestartSequencerResponse, RestartSequencerSuccess } from '@tmtsoftware/esw-ts'

export const handleReloadScriptResponse = (res: RestartSequencerResponse): RestartSequencerSuccess => {
  switch (res._type) {
    case 'Success':
      return res
    case 'LoadScriptError':
      throw new Error(res.reason)

    case 'LocationServiceError':
      throw new Error(res.reason)

    case 'Unhandled':
      throw new Error(res.msg)

    case 'FailedResponse':
      throw new Error(res.reason)
  }
}
