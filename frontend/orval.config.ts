import { defineConfig } from 'orval'

export default defineConfig({
  luxis: {
    input: {
      // Usar arquivo local gerado pelo backend (npm run generate:spec no backend)
      // Para usar o servidor ao vivo: target: 'http://localhost:3000/api/docs-json'
      target: '../backend/openapi.json'
    },
    output: {
      mode: 'tags-split',
      target: 'src/api',
      schemas: 'src/api/model',
      client: 'react-query',
      override: {
        mutator: {
          path: 'src/lib/orval-mutator.ts',
          name: 'customInstance'
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true
        }
      },
      prettier: true,
      clean: true
    }
  }
})
