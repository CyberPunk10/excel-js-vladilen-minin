import { $ } from '@core/dom'

export class TableSelection {
  static className = 'selected'

  constructor($root) {
    this.$root = $root
    this.group = [] // место для хранения выбранных ячеек
    this.startCell = null // первая ячейка при выборе нескольких ячеек с помощью SHIFT
  }

  select($el) {
    this.clear()
    this.group.push($el)
    $el.classList.add(TableSelection.className)
    this.startCell = $el
  }

  // очищает массив выбранных ячеек и удаляет класс .selected
  clear(group) {
    if (group) {
      this.group.forEach(el => el.classList.remove('selected-group'))
    } else {
      this.group.forEach(el => el.classList.remove(`selected`, 'selected-group'))
    }
    this.group = []
  }

  selectGroup(target) {
    this.clear('group')

    const startParsed = ($.parsedRowCol(this.startCell)) // {row: 1, col: 1} стартовая ячейка
    const targetParsed = ($.parsedRowCol(target)) // {row: 2, col: 2} текущая ячейка
    const rows = range(startParsed.row, targetParsed.row) // [1, 2] массив с номерами строк
    const cols = range(startParsed.col, targetParsed.col) // [1, 2] массив с номерами колонок

    // 1 способ
    for (let i = 0; i < rows.length; i++) {
      const $cell = this.$root.querySelector(`#row-${rows[i]}`)
      for (let j = 0; j < cols.length; j++) {
        this.group.push($cell.querySelector(`.excel-table__row-data [data-row-col="${rows[i]}:${cols[j]}"]`))
      }
    }

    // 2 способ
    // const rowCols = cols.reduce((acc, col) => {
    //   rows.forEach(row => acc.push(`${row}:${col}`))
    //   return acc
    // }, [])
    // this.group = rowCols.map(id => this.$root.querySelector(`[data-row-col="${id}"]`))

    this.group.forEach(el => el.classList.add('selected-group'))
  }
}

// create array заполненный от start до end (if (start: 2, end: 5) то получим [2,3,4,5])
function range(start, end) {
  const lengthArr = (start <= end) ? end - start + 1 : start - end + 1
  const firstNum = (start <= end) ? start : end
  return new Array(lengthArr) // в скобках задаем длину массива
      .fill('')
      .map( (_, index) => firstNum + index)
}