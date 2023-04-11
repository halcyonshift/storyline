import { Q } from '@nozbe/watermelondb'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import App from '@sl/App'
import database from '@sl/db'
import {
    CharacterModel,
    ItemModel,
    LocationModel,
    NoteModel,
    SectionModel,
    WorkModel
} from '@sl/db/models'
import '@sl/i18n'
import * as Layouts from '@sl/layouts'
import { MessengerProvider } from '@sl/layouts/useMessenger'
import { SettingsProvider } from '@sl/theme/useSettings'
import * as StoryLineViews from '@sl/views/StoryLine'
import * as WorkViews from '@sl/views/Work'

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
                        element: <StoryLineViews.ImportWorkView />
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
                path: 'work/:work_id',
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
                        element: <WorkViews.DashboardView />
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
                        path: 'addNote/:mode?/:id?',
                        element: <WorkViews.AddNoteView />,
                        loader: async ({ params }) => {
                            return params.mode && params.id
                                ? await database
                                      .get<
                                          CharacterModel | ItemModel | LocationModel | SectionModel
                                      >(params.mode)
                                      .find(params.id)
                                : null
                        }
                    },
                    {
                        path: 'backupRestore',
                        element: <WorkViews.BackupRestoreView />
                    },
                    {
                        path: 'character/:character_id',
                        id: 'character',
                        loader: async ({ params }) =>
                            await database
                                .get<CharacterModel>('character')
                                .find(params.character_id),
                        children: [
                            {
                                index: true,
                                element: <WorkViews.CharacterView />
                            },
                            {
                                path: 'edit',
                                element: <WorkViews.EditCharacterView />
                            }
                        ]
                    },
                    {
                        path: 'edit',
                        element: <WorkViews.EditWorkView />
                    },
                    {
                        path: 'insight',
                        element: <WorkViews.InsightView />
                    },
                    {
                        path: 'item/:item_id',
                        id: 'item',
                        loader: async ({ params }) =>
                            await database.get<ItemModel>('item').find(params.item_id),
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
                        path: 'note/:note_id',
                        id: 'note',
                        loader: async ({ params }) =>
                            await database.get<NoteModel>('note').find(params.note_id),
                        children: [
                            {
                                index: true,
                                element: <WorkViews.NoteView />
                            },
                            {
                                path: 'add',
                                element: <WorkViews.AddNoteView />
                            },
                            {
                                path: 'edit',
                                element: <WorkViews.EditNoteView />
                            }
                        ]
                    },
                    {
                        path: 'connection',
                        element: <WorkViews.ConnectionView />
                    },
                    {
                        path: 'section/:section_id/:query?/:index?',
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
                                element: <WorkViews.EditSectionView />
                            }
                        ]
                    },
                    {
                        path: 'overview',
                        element: <WorkViews.OverviewView />
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
            <MessengerProvider>
                <RouterProvider router={router} />
            </MessengerProvider>
        </SettingsProvider>
    </DatabaseProvider>
)
