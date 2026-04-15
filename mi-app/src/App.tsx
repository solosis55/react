import { useState, type ReactNode } from 'react'
import './App.css'
import { getDaysDifference } from './utils/date'

type ColumnDefinition<T> = {
  key: keyof T
  header: string
  render?: (value: T[keyof T], row: T) => ReactNode
}

type DataTableProps<T> = {
  data: T[]
  columns: ColumnDefinition<T>[]
  rowKey: (row: T, index: number) => string | number
}

function DataTable<T>({ data, columns, rowKey }: DataTableProps<T>) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={rowKey(row, index)}>
            {columns.map((column) => {
              const cellValue = row[column.key]

              return (
                <td key={String(column.key)}>
                  {column.render ? column.render(cellValue, row) : String(cellValue)}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type Person = {
  id: number
  name: string
  role: string
  active: boolean
}

const initialPeople: Person[] = [
  { id: 1, name: 'Ana', role: 'Frontend', active: true },
  { id: 2, name: 'Luis', role: 'Backend', active: false },
  { id: 3, name: 'Carla', role: 'QA', active: true },
]

function App() {
  const [people, setPeople] = useState<Person[]>(initialPeople)
  const [editingId, setEditingId] = useState<Person['id'] | null>(null)
  const [editDraft, setEditDraft] = useState<Partial<Person>>({})
  const [startDateValue, setStartDateValue] = useState<string>('2026-04-01')
  const [endDateValue, setEndDateValue] = useState<string>('2026-04-14')

  const startEditing = (row: Person) => {
    setEditingId(row.id)
    setEditDraft({
      name: row.name,
      role: row.role,
      active: row.active,
    })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditDraft({})
  }

  const saveEdit = () => {
    if (editingId === null) return

    setPeople((currentRows) =>
      currentRows.map((row) =>
        row.id === editingId ? { ...row, ...editDraft, id: row.id } : row,
      ),
    )

    cancelEditing()
  }

  const columns: ColumnDefinition<Person>[] = [
    { key: 'name', header: 'Nombre' },
    { key: 'role', header: 'Rol' },
    {
      key: 'active',
      header: 'Estado',
      render: (value) => (value ? 'Activo' : 'Inactivo'),
    },
    {
      key: 'id',
      header: 'Acciones',
      render: (_, row) => (
        <button onClick={() => startEditing(row)} disabled={editingId === row.id}>
          Editar
        </button>
      ),
    },
  ]

  const hasBothDates = startDateValue !== '' && endDateValue !== ''
  const parsedStartDate = hasBothDates ? new Date(`${startDateValue}T00:00:00`) : null
  const parsedEndDate = hasBothDates ? new Date(`${endDateValue}T00:00:00`) : null

  let dateDifferenceMessage = 'Selecciona ambas fechas para calcular.'
  if (parsedStartDate && parsedEndDate) {
    try {
      const difference = getDaysDifference(parsedStartDate, parsedEndDate)
      dateDifferenceMessage = `La diferencia es de ${difference} dias.`
    } catch {
      dateDifferenceMessage = 'Una o ambas fechas no son validas.'
    }
  }

  return (
    <>
      <header className="app-title-bar">
        <h1>DataTable generica con TypeScript</h1>
      </header>

      <main className="app-container">
        <p className="lead-text">
          Ejemplo de <code>DataTable&lt;T&gt;</code> que recibe datos y columnas por
          props.
        </p>
        <section className="date-section">
          <h2>Calculo de dias con date-fns</h2>
          <div className="date-inputs">
            <label className="field">
              Fecha inicio
              <input
                type="date"
                value={startDateValue}
                onChange={(event) => setStartDateValue(event.target.value)}
              />
            </label>

            <label className="field">
              Fecha fin
              <input
                type="date"
                value={endDateValue}
                onChange={(event) => setEndDateValue(event.target.value)}
              />
            </label>
          </div>
          <p className="date-result">{dateDifferenceMessage}</p>
        </section>

        <DataTable<Person>
          data={people}
          columns={columns}
          rowKey={(row) => row.id}
        />

        <section className="editor-section">
          <h2>Edicion de fila con Partial&lt;Person&gt;</h2>

          {editingId === null ? (
            <p className="editor-hint">Selecciona una fila para editar.</p>
          ) : (
            <div className="editor-form">
              <label className="field">
                Nombre
                <input
                  type="text"
                  value={editDraft.name ?? ''}
                  onChange={(event) =>
                    setEditDraft((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </label>

              <label className="field">
                Rol
                <input
                  type="text"
                  value={editDraft.role ?? ''}
                  onChange={(event) =>
                    setEditDraft((current) => ({ ...current, role: event.target.value }))
                  }
                />
              </label>

              <label className="field field-checkbox">
                Activo
                <input
                  type="checkbox"
                  checked={Boolean(editDraft.active)}
                  onChange={(event) =>
                    setEditDraft((current) => ({ ...current, active: event.target.checked }))
                  }
                />
              </label>

              <div className="actions">
                <button onClick={saveEdit}>Guardar</button>
                <button onClick={cancelEditing}>Cancelar</button>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  )
}

export default App
