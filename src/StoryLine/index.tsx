/** @format */

import { Q } from '@nozbe/watermelondb'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import ReactDOM from 'react-dom/client'

import { createHashRouter, RouterProvider } from 'react-router-dom'

import App from './App'
import database from './db'
import { WorkModel } from './db/models'
import './i18n'
import * as StoryLineScreens from './section/storyline'
import * as Layouts from './ui/layouts'
import { DisplayProvider } from './ui/hooks/theme'

const router = createHashRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <p>404</p>,
        children: [
            {
                element: <Layouts.StoryLineLayout />,
                children: [
                    {
                        index: true,
                        element: <StoryLineScreens.LandingScreen />,
                        loader: async () =>
                            await database
                                .get<WorkModel>('work')
                                .query(Q.sortBy('last_opened_at', Q.desc), Q.take(5))
                                .fetch()
                    },
                    {
                        path: 'openWork',
                        element: <StoryLineScreens.OpenWorkScreen />,
                        loader: async () =>
                            await database
                                .get<WorkModel>('work')
                                .query(Q.sortBy('title', Q.asc))
                                .fetch()
                    },
                    {
                        path: 'newWork',
                        element: <StoryLineScreens.SettingsScreen />
                    },
                    {
                        path: 'newSequel',
                        element: <StoryLineScreens.SettingsScreen />
                    },
                    {
                        path: 'importWork',
                        element: <StoryLineScreens.SettingsScreen />
                    },
                    {
                        path: 'settings',
                        element: <StoryLineScreens.SettingsScreen />
                    },
                    {
                        path: 'info',
                        element: <StoryLineScreens.InfoScreen />
                    }
                ]
            }
        ]
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <DatabaseProvider database={database}>
        <DisplayProvider>
            <RouterProvider router={router} />
        </DisplayProvider>
    </DatabaseProvider>
)
