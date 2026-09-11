Fluxo recomendado: upload direto para Cloudinary (presigned) e envio de `photoUrl` ao backend

Resumo
- O frontend obtém do backend uma `signature` (timestamp + signature + apiKey + cloudName + folder).
- O frontend envia o arquivo diretamente para a API REST do Cloudinary usando essa assinatura.
- O Cloudinary retorna uma `secure_url` que é enviada ao backend no payload JSON (ex.: `photoUrl`).

Vantagens
- Evita que o backend processe multipart/form-data e elimina necessidade de `multer`.
- Menor carga no backend e melhores práticas de segurança/escala.

Exemplo (browser / Next.js client)

```js
// 1) buscar assinatura do backend
const sigRes = await fetch('/api/product-models/cloudinary-signature')
const sig = await sigRes.json()

// 2) enviar arquivo direto ao Cloudinary
const form = new FormData()
form.append('file', fileBlob)
form.append('api_key', sig.apiKey)
form.append('timestamp', sig.timestamp)
form.append('signature', sig.signature)
form.append('folder', sig.folder)

const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
  method: 'POST',
  body: form
})
const uploadData = await uploadRes.json()
const secureUrl = uploadData.secure_url

// 3) enviar para o backend o `photoUrl`
await fetch('/api/product-models', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, categoryId, suggestedPrice, photoUrl: secureUrl })
})
```

Nota sobre `photo` vs `photoUrl`
- O backend agora aceita `photoUrl` (URL remoto retornado pelo Cloudinary) e, como fallback, aceita strings base64 ou objetos de arquivo com `buffer` (para uploads server-side).

Se quiser, crio um exemplo de componente React/Next.js completo e o PR para integrar ao repositório.
