import { mountApp } from './mount'
import './styles.css'

const root = document.getElementById('root')

if (!root) throw new Error('Missing application root')

mountApp(root)
