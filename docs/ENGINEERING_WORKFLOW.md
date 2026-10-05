# Engineering Workflow — Vertical SaaS Radar

## Perfil
Radar evidence-first de produtos/mercado — **dados + análise + produto web**.

## Padrão
Pergunta → fontes → critérios → coleta → validação → modelagem → implementação → testes → revisão → publicação → monitoramento.

## Loop
**Ler → Compreender → Planejar → Implementar → Validar dados → Testar → Revisar → Corrigir → Commit → Atualizar documentação.**

## Regras específicas
- Toda afirmação relevante deve ser rastreável à fonte.
- Separar dado observado, inferência e recomendação.
- Registrar data/freshness das evidências.
- Não substituir ausência de dado por estimativa silenciosa.
- Mudanças de schema/data pipeline exigem validação de qualidade.
- UI deve deixar claro estado vazio, erro, dado desatualizado e incerteza.
- Métricas derivadas precisam de fórmula documentada e teste.

## Gate
Validação de dados → testes → build → revisão → preview/QA → produção → smoke.
