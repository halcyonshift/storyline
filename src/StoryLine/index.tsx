/** @format */

import { Q } from '@nozbe/watermelondb'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import ReactDOM from 'react-dom/client'

import { createHashRouter, RouterProvider } from 'react-router-dom'

import database from './db'
import { ProjectModel } from './db/models'
import './i18n'
import * as Layouts from './ui/layouts'
import * as StoryLineScreens from './screens/storyline'
import ColorModeProvider from './ui/display/colorMode/context'
import App from './App'

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
                                .get<ProjectModel>('project')
                                .query(Q.sortBy('last_opened_at', Q.desc), Q.take(5))
                                .fetch()
                    },
                    {
                        path: 'settings',
                        element: <StoryLineScreens.SettingsScreen />
                    }
                ]
            }
        ]
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <DatabaseProvider database={database}>
        <ColorModeProvider>
            <RouterProvider router={router} />
        </ColorModeProvider>
    </DatabaseProvider>
)
