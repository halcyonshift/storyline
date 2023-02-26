/** @format */

import { contextBridge } from 'electron'
import api from './StoryLine/api'

contextBridge.exposeInMainWorld('api', api)
