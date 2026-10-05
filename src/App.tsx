import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Play,
  Pause,
  RotateCcw,
  Download,
  Eye,
  EyeOff,
  MapPin,
  Clock,
  Heart,
  Sparkles,
  Navigation,
  SlidersHorizontal,
  Layers,
  Route,
} from 'lucide-react';
import { INITIAL_COURSES } from './data/courses';
import type {
  GpsArtCourse,
  RegionCategory,
  ShapeCategory,
} from './types/course';
import { CourseMiniPreview } from './components/CourseMiniPreview';
import { GalleryMap } from './components/GalleryMap';
import { downloadCourseGpx } from './utils/gpx';

const LIKES_STORAGE_KEY = 'trace_gallery_liked_ids_v1';

export function App() {
  const [courses, setCourses] = useState<GpsArtCourse[]>(INITIAL_COURSES);

  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LIKES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionCategory>('전체');
  const [selectedShape, setSelectedShape] = useState<ShapeCategory>('전체');
  const [distanceFilter, setDistanceFilter] = useState<
    'all' | 'under6' | '6to8' | 'over8'
  >('all');

  // Selected course state
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    INITIAL_COURSES[0].id
  );

  // Gallery Overlay & Animation states
  const [showRouteLine, setShowRouteLine] = useState(true);
  const [showIllustrationOverlay, setShowIllustrationOverlay] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(0.24);
  const [showWaypoints, setShowWaypoints] = useState(true);
  const [mapStyle, setMapStyle] = useState<'light' | 'dark' | 'color'>('light');

  // Start -> Finish Animation playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(100); // 0 to 100
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (selectedRegion !== '전체' && c.region !== selectedRegion) {
        return false;
      }
      if (selectedShape !== '전체' && c.shapeCategory !== selectedShape) {
        return false;
      }
      if (distanceFilter === 'under6' && c.distanceKm >= 6) return false;
      if (
        distanceFilter === '6to8' &&
        (c.distanceKm < 6 || c.distanceKm > 8)
      ) {
        return false;
      }
      if (distanceFilter === 'over8' && c.distanceKm <= 8) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchShape = c.shapeName.toLowerCase().includes(q);
        const matchDistrict = c.district.toLowerCase().includes(q);
        const matchStation = c.nearestStation.toLowerCase().includes(q);
        const matchTags = c.tags.some((t) => t.toLowerCase().includes(q));
        return (
          matchTitle ||
          matchShape ||
          matchDistrict ||
          matchStation ||
          matchTags
        );
      }
      return true;
    });
  }, [
    courses,
    selectedRegion,
    selectedShape,
    distanceFilter,
    searchQuery,
  ]);

  const selectedCourse = useMemo(() => {
    return (
      courses.find((c) => c.id === selectedCourseId) ||
      filteredCourses[0] ||
      null
    );
  }, [courses, selectedCourseId, filteredCourses]);

  // Animation loop for Start -> Finish route drawing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setAnimationProgress((prev) => {
        const next = prev + 0.55 * playbackSpeed;
        if (next >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleSelectCourse = (course: GpsArtCourse) => {
    setSelectedCourseId(course.id);
    setIsPlaying(false);
    setAnimationProgress(100);
  };

  const handleTogglePlay = () => {
    setShowRouteLine(true);
    if (!isPlaying && animationProgress >= 99.5) {
      setAnimationProgress(2);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleRestartAnimation = () => {
    setShowRouteLine(true);
    setAnimationProgress(2);
    setIsPlaying(true);
  };

  const handleToggleLike = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const alreadyLiked = likedIds.includes(courseId);
    const nextLiked = alreadyLiked
      ? likedIds.filter((id) => id !== courseId)
      : [...likedIds, courseId];
    setLikedIds(nextLiked);
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(nextLiked));

    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, likes: c.likes + (alreadyLiked ? -1 : 1) }
          : c
      )
    );
  };

  // Determine active waypoint description during animation
  const activeWaypoint = useMemo(() => {
    if (!selectedCourse || selectedCourse.waypoints.length === 0) return null;
    const totalCoords = selectedCourse.coordinates.length;
    const currentIdx = Math.floor((animationProgress / 100) * (totalCoords - 1));
    let currentWp = selectedCourse.waypoints[0];
    for (const wp of selectedCourse.waypoints) {
      if (currentIdx >= wp.index) {
        currentWp = wp;
      }
    }
    return currentWp;
  }, [selectedCourse, animationProgress]);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-zinc-50 text-zinc-900">
      {/* LEFT PANEL: Minimal Gallery Search & Course Archive */}
      <aside className="w-full lg:w-[440px] xl:w-[470px] h-[48vh] lg:h-full flex-shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-200 bg-white flex flex-col z-20 shadow-xs">
        {/* Top Brand */}
        <header className="px-5 pt-4 pb-3.5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <h1 className="font-black text-base tracking-tight text-zinc-950">
                TRACE GALLERY
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                KR ARCHIVE
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              흑백 도시 지도 위에 그리는 대한민국 GPS 아트 컬렉션
            </p>
          </div>
        </header>

            {/* Search & Multi-Filter Controls */}
            <div className="px-5 py-3.5 border-b border-zinc-100 space-y-3 bg-zinc-50/50">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="강아지, 고양이, 하트, 고래, 올림픽공원, 성수 검색..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-zinc-200/90 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  >
                    지우기
                  </button>
                )}
              </div>

              {/* Region Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                {(
                  [
                    '전체',
                    '서울',
                    '대전·충청',
                    '부산·경남',
                    '제주·기타',
                  ] as RegionCategory[]
                ).map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedRegion === reg
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'bg-white text-zinc-600 border border-zinc-200/80 hover:border-zinc-400'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>

              {/* Shape Category & Distance Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {(
                    [
                      '전체',
                      '동물',
                      '하트·심볼',
                      '해양생물',
                      '캐릭터·기타',
                    ] as ShapeCategory[]
                  ).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedShape(cat)}
                      className={`px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        selectedShape === cat
                          ? 'bg-orange-500/15 text-orange-600 border border-orange-500/30'
                          : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <select
                  value={distanceFilter}
                  onChange={(e) =>
                    setDistanceFilter(
                      e.target.value as 'all' | 'under6' | '6to8' | 'over8'
                    )
                  }
                  className="text-[11px] font-semibold text-zinc-600 bg-white border border-zinc-200 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="all">모든 거리</option>
                  <option value="under6">6km 미만</option>
                  <option value="6to8">6~8km</option>
                  <option value="over8">8km 이상</option>
                </select>
              </div>
            </div>

            {/* Result Count Subbar */}
            <div className="px-5 py-2 border-b border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 bg-white">
              <span>
                총 <strong className="text-zinc-900">{filteredCourses.length}</strong>개의
                작품 코스
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                카드 클릭 시 지도 이동 및 주행 재생 가능
              </span>
            </div>

            {/* Course List */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
              {filteredCourses.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <p className="text-sm font-bold text-zinc-700">
                    조건에 맞는 GPS 아트 코스가 없습니다.
                  </p>
                  <p className="text-xs text-zinc-400">
                    검색어나 지역/모양 필터를 초기화해 보세요.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRegion('전체');
                      setSelectedShape('전체');
                      setDistanceFilter('all');
                    }}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold cursor-pointer"
                  >
                    필터 전체 초기화
                  </button>
                </div>
              ) : (
                filteredCourses.map((course) => {
                  const isSelected = selectedCourse?.id === course.id;
                  const isLiked = likedIds.includes(course.id);

                  return (
                    <div
                      key={course.id}
                      onClick={() => handleSelectCourse(course)}
                      className={`group p-4 flex gap-3.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-900/[0.035] border-l-4 border-l-zinc-900'
                          : 'hover:bg-zinc-50'
                      }`}
                    >
                      {/* Mini SVG Gallery Preview */}
                      <CourseMiniPreview
                        course={course}
                        showIllustration={showIllustrationOverlay}
                        size={86}
                      />

                      {/* Card Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span
                                style={{
                                  backgroundColor: `${course.accentColor}18`,
                                  color: course.accentColor,
                                }}
                                className="text-[10px] font-extrabold px-1.5 py-0.5 rounded"
                              >
                                {course.shapeName}
                              </span>
                              <span className="text-[11px] font-semibold text-zinc-500 truncate">
                                {course.region} · {course.district.split('·')[0]}
                              </span>
                            </div>

                            <button
                              onClick={(e) => handleToggleLike(course.id, e)}
                              className={`flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                                isLiked
                                  ? 'text-rose-500 bg-rose-50'
                                  : 'text-zinc-400 hover:text-zinc-700'
                              }`}
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${
                                  isLiked ? 'fill-rose-500 text-rose-500' : ''
                                }`}
                              />
                              <span>{course.likes}</span>
                            </button>
                          </div>

                          <h3 className="font-bold text-sm text-zinc-900 mt-1 truncate group-hover:text-black">
                            {course.title}
                          </h3>
                          <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                            {course.subtitle}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-zinc-100 text-[11px] text-zinc-600">
                          <div className="flex items-center gap-2.5 font-semibold">
                            <span className="text-zinc-900 font-bold">
                              {course.distanceKm} km
                            </span>
                            <span className="text-zinc-300">|</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-zinc-400" />약{' '}
                              {course.estimatedMinutes}분
                            </span>
                            <span className="text-zinc-300">|</span>
                            <span>난이도 {course.difficulty}</span>
                          </div>

                          {isSelected && (
                            <span
                              style={{ color: course.accentColor }}
                              className="text-[10px] font-extrabold flex items-center gap-0.5"
                            >
                              감상 중 ●
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
      </aside>

      {/* RIGHT PANEL: Interactive Monochrome Map + Artwork Overlay & Animation Player */}
      <main className="flex-1 relative h-[52vh] lg:h-full overflow-hidden">
        {/* Top Floating Gallery Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Left: Illustration Overlay & Opacity Controls */}
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-zinc-200/80">
            {/* 코스 선 (경로선) 켜기/끄기 */}
            <button
              onClick={() => setShowRouteLine((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                showRouteLine
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
              title="지도 위의 코스 경로선(GPS 라인) 켜기/끄기"
            >
              <Route className={`w-3.5 h-3.5 ${showRouteLine ? 'text-violet-400' : ''}`} />
              <span>선(경로) {showRouteLine ? 'ON' : 'OFF'}</span>
            </button>

            {/* 그림(눈·귀·실루엣) 토글 */}
            <button
              onClick={() =>
                setShowIllustrationOverlay((prev) => !prev)
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                showIllustrationOverlay
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {showIllustrationOverlay ? (
                <Eye className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
              <span>
                그림(눈·귀·실루엣){' '}
                {showIllustrationOverlay ? 'ON' : 'OFF'}
              </span>
            </button>

            {showIllustrationOverlay && (
              <div className="hidden sm:flex items-center gap-2 px-2 border-l border-zinc-200">
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[11px] font-semibold text-zinc-500">
                  채우기 농도
                </span>
                <input
                  type="range"
                  min={0.05}
                  max={0.55}
                  step={0.05}
                  value={overlayOpacity}
                  onChange={(e) =>
                    setOverlayOpacity(parseFloat(e.target.value))
                  }
                  className="w-16 accent-zinc-900 cursor-pointer"
                />
              </div>
            )}

            <button
              onClick={() => setShowWaypoints((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                showWaypoints
                  ? 'bg-zinc-100 text-zinc-900 border border-zinc-300'
                  : 'text-zinc-500 hover:bg-zinc-100'
              }`}
            >
              <Navigation className="w-3 h-3" />
              <span>꺾임 구간 핀</span>
            </button>
          </div>

          {/* Right: Minimal Gallery Map Tone Switcher */}
          <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-md border border-zinc-200/80">
            <Layers className="w-3.5 h-3.5 text-zinc-400 ml-1.5 mr-0.5" />
            {(
              [
                { id: 'light', label: '흑백 갤러리' },
                { id: 'dark', label: '다크 갤러리' },
                { id: 'color', label: '컬러 지도' },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                onClick={() => setMapStyle(mode.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  mapStyle === mode.id
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leaflet Map Canvas */}
        <GalleryMap
          courses={filteredCourses}
          selectedCourse={selectedCourse}
          onSelectCourse={handleSelectCourse}
          showRouteLine={showRouteLine}
          showIllustrationOverlay={showIllustrationOverlay}
          overlayOpacity={overlayOpacity}
          showWaypoints={showWaypoints}
          animationProgress={animationProgress}
          isPlaying={isPlaying}
          mapStyle={mapStyle}
        />

        {/* Bottom Floating Selected Course Detail & Start->Finish Animation Dock */}
        {selectedCourse && (
          <div className="absolute bottom-5 left-4 right-4 md:left-6 md:right-14 z-10 pointer-events-none flex justify-center">
            <div className="pointer-events-auto w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-200/90 p-4 md:p-5 space-y-3.5">
              {/* Top Row: Course Title, Station Info & GPX Download */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      style={{ backgroundColor: selectedCourse.accentColor }}
                      className="text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full shadow-2xs"
                    >
                      {selectedCourse.shapeName} 아트
                    </span>
                    <h2 className="text-base md:text-lg font-black text-zinc-900 tracking-tight">
                      {selectedCourse.title}
                    </h2>
                    <span className="text-xs font-bold text-zinc-500">
                      {selectedCourse.distanceKm} km · 약{' '}
                      {selectedCourse.estimatedMinutes}분
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-zinc-900" />
                      출발: <strong>{selectedCourse.startPointName}</strong>
                    </span>
                    <span className="text-zinc-300">|</span>
                    <span className="text-zinc-500">
                      {selectedCourse.nearestStation}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => downloadCourseGpx(selectedCourse)}
                    className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="스마트워치·런데이·스트라바용 GPX 경로 파일 다운로드"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>GPX 다운로드</span>
                  </button>
                </div>
              </div>

              {/* Bottom Row: Start -> Finish Running Order Animation Player */}
              <div className="p-3 rounded-xl bg-zinc-900 text-white flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlay}
                    style={{ backgroundColor: selectedCourse.accentColor }}
                    className="px-3.5 py-2 rounded-lg text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>일시정지</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>주행 순서 재생</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleRestartAnimation}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="출발점부터 다시 그리기"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {/* Speed Toggle */}
                  <button
                    onClick={() =>
                      setPlaybackSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))
                    }
                    className="px-2 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-bold text-zinc-200 cursor-pointer"
                    title="애니메이션 배속 변경"
                  >
                    {playbackSpeed}x
                  </button>
                </div>

                {/* Progress Scrubber & Live Distance */}
                <div className="flex-1 flex flex-col justify-center gap-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-zinc-200 truncate">
                      {activeWaypoint
                        ? `📍 ${activeWaypoint.title} — ${activeWaypoint.description}`
                        : '출발지부터 도착지까지 달리는 순서대로 그림이 완성됩니다'}
                    </span>
                    <span className="font-mono font-bold text-amber-400 ml-2 whitespace-nowrap">
                      {(
                        (animationProgress / 100) *
                        selectedCourse.distanceKm
                      ).toFixed(1)}{' '}
                      / {selectedCourse.distanceKm} km (
                      {Math.round(animationProgress)}%)
                    </span>
                  </div>

                  <input
                    type="range"
                    min={1}
                    max={100}
                    step={0.5}
                    value={animationProgress}
                    onChange={(e) => {
                      setIsPlaying(false);
                      setAnimationProgress(parseFloat(e.target.value));
                    }}
                    style={{ accentColor: selectedCourse.accentColor }}
                    className="w-full h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
