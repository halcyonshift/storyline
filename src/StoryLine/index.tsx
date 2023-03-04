import { Q } from '@nozbe/watermelondb'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import ReactDOM from 'react-dom/client'

import { createHashRouter, RouterProvider } from 'react-router-dom'

import App from './App'
import database from './db'
import { SectionModel, WorkModel } from './db/models'
import './i18n'
import * as StoryLineViews from './ui/views/storyline'
import * as WorkViews from './ui/views/work'
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
                        element: <StoryLineViews.LandingView />,
                        loader: async () =>
                            await database
                                .get<WorkModel>('work')
                                .query(Q.sortBy('last_opened_at', Q.desc), Q.take(5))
                                .fetch()
                    },
                    {
                        path: 'newWork',
                        element: <StoryLineViews.NewWorkView />
                    },
                    {
                        path: 'openWork',
                        element: <StoryLineViews.OpenWorkView />,
                        loader: async () =>
                            await database
                                .get<WorkModel>('work')
                                .query(Q.sortBy('title', Q.asc))
                                .fetch()
                    },
                    {
                        path: 'newSequel',
                        element: <StoryLineViews.SettingsView />
                    },
                    {
                        path: 'importWork',
                        element: <StoryLineViews.SettingsView />
                    },
                    {
                        path: 'settings',
                        element: <StoryLineViews.SettingsView />
                    },
                    {
                        path: 'info',
                        element: <StoryLineViews.InfoView />
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
                        element: <WorkViews.LandingView />
                    },
                    {
                        path: 'addPart',
                        element: <WorkViews.AddPartView />,
                        loader: async ({ params }) =>
                            await database.get<WorkModel>('work').find(params.work_id)
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
                        element: <WorkViews.SearchView />
                    },
                    {
                        path: 'section/:section_id',
                        element: <WorkViews.SectionView />,
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
