import { Q } from '@nozbe/watermelondb'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import ReactDOM from 'react-dom/client'

import { createHashRouter, RouterProvider } from 'react-router-dom'

import App from './App'
import database from './db'
import { SectionModel, WorkModel } from './db/models'
import './i18n'
import * as StoryLineScreens from './ui/views/storyline'
import * as WorkScreens from './ui/views/work'
import * as Layouts from './ui/layouts'
import { DisplayProvider } from './ui/theme'

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
                        path: 'newWork',
                        element: <StoryLineScreens.NewWorkScreen />
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
            },
            {
                path: 'works/:work_id',
                id: 'work',
                element: <Layouts.WorkLayout />,
                children: [
                    {
                        index: true,
                        element: <WorkScreens.LandingScreen />
                    },
                    {
                        path: 'backupRestore',
                        element: <p>backupRestore</p>
                    },
                    {
                        path: 'insight',
                        element: <p>Insights</p>
                    },
                    {
                        path: 'relation',
                        element: <p>Relation</p>
                    },
                    {
                        path: 'search',
                        element: <WorkScreens.SearchScreen />
                    },
                    {
                        path: 'section/:section_id',
                        element: <WorkScreens.SectionScreen />,
                        loader: async ({ params }) =>
                            await database.get<SectionModel>('section').find(params.section_id)
                    },
                    {
                        path: 'setting',
                        element: <p>Settings</p>
                    },
                    {
                        path: 'timeline',
                        element: <p>Timeline</p>
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
