# Caminhos e instruções no iOS 26

Conferência documental em 11/09/2026. A seleção usa as capacidades explícitas de cada um dos 31 modelos em `src/data/models.ts`; `src/data/tips.ts` gera o conteúdo e filtra a disponibilidade. Não houve validação em aparelhos físicos.

| Ajuste | Variação relevante |
| --- | --- |
| Carregamento | Até 14 e nos SE: Saúde da Bateria e Carregamento, sem limite configurável. A partir do 15: Carregamento, com limite e Carregamento Otimizado disponível em 100%. |
| Saúde da bateria | Até 14 e nos SE: Saúde da Bateria e Carregamento. A partir do 15: Saúde da Bateria. |
| Siri | 15/15 Plus não têm Apple Intelligence; 15 Pro/Pro Max e famílias posteriores têm suporte. Os nomes Siri/Apple Intelligence e Siri e Falar com a Siri/Fale e Digite para a Siri não são garantidos apenas pelo hardware. Os passos incluem as alternativas nos aparelhos compatíveis. Botão de Início nos SE, lateral nos demais. |
| Central de Controle | Nos SE, gesto da borda inferior para cima; nos demais modelos do catálogo, canto superior direito para baixo. A dica de brilho detalha o gesto. |
| Tela Sempre Ativada e limite de quadros | Os caminhos são comuns entre aparelhos compatíveis; a disponibilidade é diferente. 13 Pro tem limite de quadros, mas não Tela Sempre Ativada. 16/16 Plus/16e/17e não têm nenhum dos dois. 17 e Air têm ambos. |
| 5G, Ligações Wi-Fi e Acesso Pessoal | Hardware determina suporte a 5G. Operadora, plano, região e configuração de linhas também podem alterar opções ou acrescentar a seleção da linha. Não inferir esses dados pelo modelo. |

Os demais caminhos do catálogo não exigem bifurcação por modelo nas fontes consultadas. Modo Escuro existe também em LCD, mas a dica é oferecida apenas em OLED por seu objetivo de economia. Permissões variam por aplicativo; Mail depende do provedor; controles de reprodução dependem do app; políticas de gerenciamento podem restringir opções.

Fontes oficiais em português do Brasil:

- [Carregamento](https://support.apple.com/pt-br/108055)
- [Uso e saúde da bateria — Manual iOS 26](https://support.apple.com/pt-br/guide/iphone/iphd453d043a/ios)
- [Siri — Manual iOS 26](https://support.apple.com/pt-br/guide/iphone/iph83aad8922/ios) e [requisitos da Apple Intelligence](https://support.apple.com/pt-br/121115)
- [Central de Controle](https://support.apple.com/pt-br/108330)
- [Brilho e Tela Sempre Ativada](https://support.apple.com/pt-br/109351)
- [Modelos com ProMotion — Manual iOS 26](https://support.apple.com/pt-br/guide/iphone/aside/iphfb8ca5aff/26/ios/26)
- [5G](https://support.apple.com/pt-br/108383) e [Ligações Wi-Fi](https://support.apple.com/pt-br/108066)

Os testes verificam as distinções de capacidades, os caminhos de bateria e Siri, os gestos dos 31 modelos e a troca de aparelho na interface. O caminho principal da Siri representa a configuração usual; os passos e a observação explicam as alternativas documentadas pela Apple.
