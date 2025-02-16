// import React, { useEffect, useState } from 'react'
// import ReactDOM from 'react-dom/client'
// import {
//   QueryClient,
//   QueryClientProvider,
//   useQuery,
// } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
//
// const queryClient = new QueryClient()
//
// export default function ExampleApp() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <ReactQueryDevtools />
//       <Example />
//       import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
//     </QueryClientProvider>
//   )
// }
//
// async function getData() {
//   const response = await fetch(
//     'https://api.github.com/repos/TanStack/query',
//   )
//   return await response.json()
// }
//
// function delay(ms: number) {
//   return new Promise( resolve => setTimeout(resolve, ms) )
// }
//
// async function foo() {
//   await delay(3000)
// }
//
// function useData() {
//   const [enabled, setEnabled] = useState<boolean>(false)
//   useEffect(() => {
//     foo().then(() => setEnabled(true))
//   }, [])
//   return useQuery({
//     queryKey: ['repoData'],
//     queryFn: getData,
//     enabled: enabled
//   })
// }
//
// function Example() {
//   const { isPending, error, data, isFetching } = useData()
//
//   if (isPending) return 'Loading...'
//
//   if (error) return 'An error has occurred: ' + error.message
//
//   return (
//     <div>
//       <h1>{data.full_name}</h1>
//       <p>{data.description}</p>
//       <strong>👀 {data.subscribers_count}</strong>{' '}
//       <strong>✨ {data.stargazers_count}</strong>{' '}
//       <strong>🍴 {data.forks_count}</strong>
//       <div>{isFetching ? 'Updating...' : ''}</div>
//     </div>
//   )
// }
//
// const rootElement = document.getElementById('root') as HTMLElement
// ReactDOM.createRoot(rootElement).render(<ExampleApp />)
