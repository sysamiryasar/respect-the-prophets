import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { JourneyProvider, useJourney } from './lib/journey'

import AppShell from './components/AppShell'
import JourneyPage from './pages/JourneyPage'

/* The opening page is all that is needed for first paint; every chapter is
   its own chunk, fetched when the reader opens it. */
const HomePage = lazy(() => import('./pages/HomePage'))
const WhyPage = lazy(() => import('./pages/WhyPage'))
const PillarsPage = lazy(() => import('./pages/PillarsPage'))
const ProphetsPage = lazy(() => import('./pages/ProphetsPage'))
const ProphetPage = lazy(() => import('./pages/ProphetPage'))
const StoriesPage = lazy(() => import('./pages/StoriesPage'))
const ScenePage = lazy(() => import('./pages/ScenePage'))
const QuranPage = lazy(() => import('./pages/QuranPage'))
const LessonsPage = lazy(() => import('./pages/LessonsPage'))
const RespectPage = lazy(() => import('./pages/RespectPage'))
const ConstellationPage = lazy(() => import('./pages/ConstellationPage'))
const FinalPage = lazy(() => import('./pages/FinalPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function ChapterFallback() {
  return (
    <div
      className="flex min-h-[100svh] items-center justify-center bg-ink"
      role="status"
      aria-live="polite"
    >
      <span className="text-[0.64rem] tracking-[0.4em] text-gold/40 uppercase">
        Opening the chapter…
      </span>
    </div>
  )
}

function Shell() {
  const { reduced } = useJourney()
  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<JourneyPage />} />
          <Route
            path="chapters"
            element={
              <Suspense fallback={<ChapterFallback />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="why"
            element={
              <Suspense fallback={<ChapterFallback />}>
                <WhyPage />
              </Suspense>
            }
          />
          <Route
            path="pillars"
            element={
              <Suspense fallback={<ChapterFallback />}>
                <PillarsPage />
              </Suspense>
            }
          />
          <Route
            path="prophets"
            element={
              <Suspense fallback={<ChapterFallback />}>
                <ProphetsPage />
              </Suspense>
            }
          />
          <Route
            path="prophets/:id"
            element={
              <Suspense fallback={<ChapterFallback />}>
                <ProphetPage />
              </Suspense>
            }
          />
          <Route
            path="stories"
            element={
              <Suspense fallback={<ChapterFallback />}>
                <StoriesPage />
              </Suspense>
            }
          />
          <Route
            path="stories/:id"
            element={
              <Suspense fallback={<ChapterFallback />}>
                <ScenePage />
              </Suspense>
            }
          />
          <Route
            path="quran"
            element={
              <Suspense fallback={<ChapterFallback />}>
                <QuranPage />
              </Suspense>
            }
          />
          <Route
            path="lessons"
            element={
              <Suspense fallback={<ChapterFallback />}>
                <LessonsPage />
              </Suspense>
            }
          />
          <Route
            path="respect"
            element={
              <Suspense fallback={<ChapterFallback />}>
                <RespectPage />
              </Suspense>
            }
          />
          <Route
            path="constellation"
            element={
              <Suspense fallback={<ChapterFallback />}>
                <ConstellationPage />
              </Suspense>
            }
          />
          <Route
            path="final"
            element={
              <Suspense fallback={<ChapterFallback />}>
                <FinalPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<ChapterFallback />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </MotionConfig>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <JourneyProvider>
        <Shell />
      </JourneyProvider>
    </BrowserRouter>
  )
}
