# @lumen/zod

Integração de validação de schemas **Zod** com o Lumen: adapta schemas Zod ao contrato `SchemaLike` do framework para uso em pipes/validação.

```ts
import { zodSchema, ZodSchema } from '@lumen/zod';
import { z } from 'zod';
```

---

## zodSchema / ZodSchema

```ts
const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(0),
});

// Factory
const schema = zodSchema(userSchema);

// ou: new ZodSchema(userSchema)

// Validar entrada (lança BadRequestException se inválido)
const data = schema.parse(rawInput);

// Versão partial (todos os campos opcionais) — útil p/ UPDATE/PATCH
const partial = schema.partial();
```

### `parse(input)`

Valida usando `zod.safeParse`:
- **Sucesso** → retorna os dados tipados.
- **Falha** → lança `BadRequestException('Validation failed', issues, 'VALIDATION_ERROR')` com os `zod.issues`.

### `partial()`

Devolve um `ZodSchema<Partial<T>>` para o mesmo schema com todos os campos opcionais (via `z.partial()`).

---

## Uso no Lumen

O `ZodSchema` implementa `SchemaLike<T>` de `@lumen/core`, então pode ser usado nos pontos onde o framework espera um schema de validação (pipes/DTO).

---

## Tipos e dependências

| Item | Descrição |
| --- | --- |
| `ZodSchema<T>` | Wrapper que implementa `SchemaLike<T>`. |
| `zodSchema<T>(schema)` | Factory conveniente. |

Depende de `zod`, `@lumen/core` (SchemaLike) e `@lumen/common` (`BadRequestException`).
