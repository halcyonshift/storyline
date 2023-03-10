import { Q } from '@nozbe/watermelondb'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import { createRoot } from 'react-dom/client'

import { createHashRouter, RouterProvider } from 'react-router-dom'

import App from '@sl/App'
import database from '@sl/db'
import { LocationModel, SectionModel, WorkModel } from '@sl/db/models'
import '@sl/i18n'
import * as StoryLineViews from '@sl/views/StoryLine'
import * as WorkViews from '@sl/views/Work'
import * as Layouts from '@sl/layouts'
import { SettingsProvider } from '@sl/theme'

const router = createHashRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <StoryLineViews.ErrorBoundary />,
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
                        path: 'addWork',
                        element: <StoryLineViews.AddWorkView />
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
                loader: async ({ params }) => {
                    const work = await database.get<WorkModel>('work').find(params.work_id)
                    await work.updateLastOpened()
                    return work
                },
                children: [
                    {
                        index: true,
                        element: <WorkViews.LandingView />
                    },
                    {
                        path: 'addCharacter/:mode',
                        element: <WorkViews.AddCharacterView />
                    },
                    {
                        path: 'addItem',
                        element: <WorkViews.AddItemView />
                    },
                    {
                        path: 'addLocation',
                        element: <WorkViews.AddLocationView />
                    },
                    {
                        path: 'addNote',
                        element: <WorkViews.AddNoteView />
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
                        path: 'item/:item_id',
                        id: 'item',
                        loader: async ({ params }) =>
                            await database.get<LocationModel>('item').find(params.item_id),
                        children: [
                            {
                                index: true,
                                element: <WorkViews.ItemView />
                            },
                            {
                                path: 'edit',
                                element: <WorkViews.EditItemView />
                            }
                        ]
                    },
                    {
                        path: 'location/:location_id',
                        id: 'location',
                        loader: async ({ params }) =>
                            await database.get<LocationModel>('location').find(params.location_id),
                        children: [
                            {
                                index: true,
                                element: <WorkViews.LocationView />
                            },
                            {
                                path: 'add',
                                element: <WorkViews.AddLocationView />
                            },
                            {
                                path: 'edit',
                                element: <WorkViews.EditLocationView />
                            }
                        ]
                    },
                    {
                        path: 'section/:section_id',
                        id: 'section',
                        loader: async ({ params }) =>
                            await database.get<SectionModel>('section').find(params.section_id),
                        children: [
                            {
                                index: true,
                                element: <WorkViews.SectionView />
                            },
                            {
                                path: 'edit',
                                element: <p>Edit section</p>
                            }
                        ]
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

const root = createRoot(document.getElementById('root'))

root.render(
    <DatabaseProvider database={database}>
        <SettingsProvider>
            <RouterProvider router={router} />
        </SettingsProvider>
    </DatabaseProvider>
)
