# clumsy-keyboard (wireless split, 3×6+3, Kailh PG1316S)

Беспроводная сплит-клавиатура по мотивам самодельной платы друга. Основа — конфиг wireless Corne для [Ergogen](https://ergogen.xyz).

![outline](docs/v0.3-outline.png)

## Структура
- `config.yaml` — геометрия, контур и футпринты (источник правды)
- `footprints/ceoloide/` — футпринты [ceoloide/ergogen-footprints](https://github.com/ceoloide/ergogen-footprints) (лицензия CC-BY-NC-SA-4.0, см. LICENSE внутри)
- `footprints/clumsy/` — свои футпринты: свитч PG1316S, контроллер XIAO (плоская пайка), диод SOD-123, площадки батареи
- `tools/plot_pcb.py` — QA-рендер `.kicad_pcb` в PNG без KiCad (контур + площадки)
- `docs/` — превью каждой версии
- `BOM.md` — список компонентов, `CHANGELOG.md` — история версий

## Генерация
Онлайн: на ergogen.xyz → New → From Repo → `clumsyyyduck/clumsy-keyboard`. Футпринтов `clumsy/*` на сайте нет, поэтому плата там может не собраться — точная сборка только локально.

Локально (Node 20+, Python 3 + matplotlib):
```bash
npm install
npm run check   # → output/pcbs/clumsy_pcb.kicad_pcb и output/pcb_check.png
```

## Дальше
1. Решить открытые вопросы в `BOM.md`
2. Открыть `output/pcbs/clumsy_pcb.kicad_pcb` в KiCad 8, развести трассы, DRC
3. Экспорт gerber → заказ PCB
4. ZMK-конфиг прошивки (отдельный репозиторий или папка `firmware/`)
