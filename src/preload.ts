import { contextBridge } from 'electron'
import api from '@sl/api'

contextBridge.exposeInMainWorld('api', api)
