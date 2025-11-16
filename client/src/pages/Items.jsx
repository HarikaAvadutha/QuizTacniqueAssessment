import React, { useEffect, useState } from 'react'
import { getItems, createItem, deleteItem } from '../api'

export default function Items(){
  const [items, setItems] = useState([])
  const [name, setName] = useState('')

  const load = async () => {
    const data = await getItems()
    setItems(data || [])
  }

  useEffect(()=>{ load() }, [])

  const onAdd = async (e) => {
    e.preventDefault()
    if(!name) return
    await createItem({ name })
    setName('')
    load()
  }

  const onDelete = async (id) => {
    await deleteItem(id)
    load()
  }

  return (
    <div>
      <h2>Items</h2>
      <form onSubmit={onAdd} style={{ marginBottom: 12 }}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="New item" />
        <button type="submit">Add</button>
      </form>

      <ul>
        {items.map(it => (
          <li key={it._id}>
            {it.name} {' '}
            <button onClick={()=>onDelete(it._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
