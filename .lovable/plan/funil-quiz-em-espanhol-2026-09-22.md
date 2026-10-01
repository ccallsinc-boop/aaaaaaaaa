# Funil quiz em espanhol

## Objetivo
Criar uma nova página em `/es-quiz`, inspirada na progressão do funil enviado, mas com identidade, textos e oferta próprios da Framers. A página `/es` atual permanece intacta.

## Experiência
- Abertura direta no quiz, com uma pergunta por tela, barra de progresso, opções visuais e avanço simples.
- Etapas sobre gêneros favoritos, jogos desejados, perfil do computador, prioridade de compra e experiência atual.
- Tela curta de análise personalizada antes da apresentação da oferta.
- Resultado com seleção visual de jogos alinhada às respostas.
- VSL no meio do percurso, seguida por fotos reais enviadas por clientes.
- Prova social com depoimentos em espanhol, benefícios, bônus, garantia e resumo final.
- Última etapa dedicada à oferta, preço local quando disponível e botão para o checkout espanhol já configurado.
- Layout otimizado para celular, mantendo boa leitura e navegação no desktop.

## Rastreamento
- Registrar visualização e início do quiz.
- Registrar cada etapa concluída, resposta escolhida, progresso, conclusão do quiz, reprodução da VSL e chegada à oferta.
- Registrar `InitiateCheckout` no clique final, com valor e moeda locais.
- Como o checkout não retorna confirmação, a compra concluída continuará sendo medida pela própria plataforma de checkout.

## Implementação técnica
- Criar um componente isolado para o funil e uma rota própria `/es-quiz` com metadados exclusivos.
- Reutilizar os assets existentes de jogos, VSL e fotos de clientes, sem copiar marca, textos ou imagens do funil de referência.
- Reutilizar a detecção de país e conversão da oferta para Argentina, Chile, Colômbia, Espanha e Peru.
- Usar o pixel Meta já ativo para a oferta de jogos e eventos personalizados do quiz.
- Preservar todas as demais páginas e fluxos do projeto.

## Verificação
- Percorrer o quiz completo em celular e desktop.
- Confirmar progressão, volta entre etapas, VSL, imagens, depoimentos e preço localizado.
- Confirmar que o botão final abre o checkout correto e dispara o evento de início do checkout.
- Validar ausência de erros visuais, de execução e de compilação.
