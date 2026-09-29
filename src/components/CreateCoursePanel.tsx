import React, { useState } from 'react';
import {
  Upload,
  PenTool,
  RotateCcw,
  Check,
  X,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type {
  ArtDecoration,
  Difficulty,
  GpsArtCourse,
  RegionCategory,
  ShapeCategory,
} from '../types/course';
import { calculateTotalDistanceKm, parseGpxXml } from '../utils/gpx';

interface CreateCoursePanelProps {
  drawingPoints: [number, number][];
  drawingDecorations: ArtDecoration[];
  drawingColor: string;
  activeStickerTool: 'route' | 'eye' | 'nose' | 'blush';
  onChangeColor: (color: string) => void;
  onChangeStickerTool: (tool: 'route' | 'eye' | 'nose' | 'blush') => void;
  onUndoPoint: () => void;
  onClearDrawing: () => void;
  onImportGpxPoints: (
    points: [number, number][],
    suggestedName?: string
  ) => void;
  onSaveCourse: (newCourse: GpsArtCourse) => void;
  onCancel: () => void;
}

const ACCENT_PALETTE = [
  '#FF5500',
  '#F43F5E',
  '#8B5CF6',
  '#0EA5E9',
  '#10B981',
  '#EAB308',
];

export const CreateCoursePanel: React.FC<CreateCoursePanelProps> = ({
  drawingPoints,
  drawingDecorations,
  drawingColor,
  activeStickerTool,
  onChangeColor,
  onChangeStickerTool,
  onUndoPoint,
  onClearDrawing,
  onImportGpxPoints,
  onSaveCourse,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [shapeName, setShapeName] = useState('');
  const [region, setRegion] = useState<Exclude<RegionCategory, '전체'>>('서울');
  const [district, setDistrict] = useState('');
  const [shapeCategory, setShapeCategory] =
    useState<Exclude<ShapeCategory, '전체'>>('동물');
  const [difficulty, setDifficulty] = useState<Difficulty>('보통');
  const [startPointName, setStartPointName] = useState('');
  const [description, setDescription] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const calculatedDistance = calculateTotalDistanceKm(drawingPoints);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      const parsed = parseGpxXml(text);
      if (parsed.coordinates.length < 2) {
        setUploadError('GPX 파일에서 유효한 경로 좌표를 찾지 못했습니다.');
        return;
      }
      if (parsed.name && !title) {
        setTitle(parsed.name);
      }
      onImportGpxPoints(parsed.coordinates, parsed.name);
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (drawingPoints.length < 3) {
      setUploadError('지도 위에 최소 3개 이상의 지점을 찍거나 GPX 파일을 업로드해 주세요.');
      return;
    }

    const lats = drawingPoints.map((p) => p[0]);
    const lngs = drawingPoints.map((p) => p[1]);
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    const dist = Math.max(0.5, calculatedDistance);

    const newCourse: GpsArtCourse = {
      id: `custom-${Date.now()}`,
      title: title.trim() || `나만의 ${shapeName || '드로잉'} 런`,
      subtitle: `${district || region} 도로 위에서 완성한 커스텀 GPS 아트`,
      region,
      district: district.trim() || `${region} 주요 러닝 코스`,
      shapeCategory,
      shapeName: shapeName.trim() || '커스텀 아트',
      distanceKm: dist,
      estimatedMinutes: Math.max(10, Math.round(dist * 6.5)),
      difficulty,
      startPointName: startPointName.trim() || '출발 마커 지점',
      nearestStation: `${district || region} 인근 역`,
      accentColor: drawingColor,
      secondaryColor: '#F4F4F5',
      description:
        description.trim() ||
        '직접 경로를 그리거나 GPX 데이터를 업로드하여 등록한 GPS 아트 코스입니다.',
      tags: [shapeName || 'GPS아트', region, '커스텀코스'],
      likes: 1,
      isUserCreated: true,
      createdAt: new Date().toISOString().slice(0, 10),
      center: [centerLat, centerLng],
      zoom: 14,
      coordinates: drawingPoints,
      decorations: drawingDecorations,
      waypoints: [
        {
          index: 0,
          title: '출발 지점',
          description: startPointName.trim() || '첫 번째 경로 포인트에서 출발합니다.',
        },
      ],
    };

    onSaveCourse(newCourse);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-900 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="font-bold text-sm tracking-tight">
            새 GPS 아트 코스 등록 스튜디오
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-5 space-y-5 text-sm"
      >
        {/* Step 1: GPX Upload or Map Sketch */}
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-zinc-800 uppercase tracking-wider">
              1. 경로 입력 (GPX 파일 또는 지도 클릭)
            </span>
            <span className="text-xs font-bold text-zinc-900 bg-white px-2 py-0.5 rounded-md border border-zinc-200">
              {drawingPoints.length}개 지점 · {calculatedDistance} km
            </span>
          </div>

          {/* GPX Upload Button */}
          <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg border border-dashed border-zinc-300 bg-white hover:border-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer text-xs font-semibold text-zinc-700">
            <Upload className="w-4 h-4 text-zinc-900" />
            <span>내 GPX 파일(.gpx) 불러오기</span>
            <input
              type="file"
              accept=".gpx,application/gpx+xml,text/xml"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Map Interactive Tool Selector */}
          <div className="space-y-1.5">
            <p className="text-[11px] text-zinc-500">
              오른쪽 흑백 지도를 직접 클릭해 경로를 그리거나 눈·코 스티커를 찍어보세요:
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => onChangeStickerTool('route')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  activeStickerTool === 'route'
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>경로선 찍기</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeStickerTool('eye')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  activeStickerTool === 'eye'
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <span className="text-sm leading-none">👀</span>
                <span>눈 추가</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeStickerTool('nose')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  activeStickerTool === 'nose'
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <span className="text-sm leading-none">👃</span>
                <span>코 추가</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeStickerTool('blush')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  activeStickerTool === 'blush'
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <span className="text-sm leading-none">😊</span>
                <span>볼터치</span>
              </button>
            </div>
          </div>

          {/* Undo & Clear controls */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              {ACCENT_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChangeColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                    drawingColor === c
                      ? 'scale-125 ring-2 ring-offset-1 ring-zinc-900'
                      : 'opacity-75 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onUndoPoint}
                disabled={drawingPoints.length === 0}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                되돌리기
              </button>
              <button
                type="button"
                onClick={onClearDrawing}
                disabled={
                  drawingPoints.length === 0 && drawingDecorations.length === 0
                }
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-zinc-200 text-rose-600 hover:bg-rose-50 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                초기화
              </button>
            </div>
          </div>

          {uploadError && (
            <p className="text-xs text-rose-600 font-medium">{uploadError}</p>
          )}
        </div>

        {/* Step 2: Course Metadata */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              코스 이름 *
            </label>
            <input
              type="text"
              required
              placeholder="예: 마포 경의선숲길 토끼런"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-zinc-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                그림 모양 이름 *
              </label>
              <input
                type="text"
                required
                placeholder="예: 토끼, 강아지, 별"
                value={shapeName}
                onChange={(e) => setShapeName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-zinc-900 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                모양 카테고리
              </label>
              <select
                value={shapeCategory}
                onChange={(e) =>
                  setShapeCategory(
                    e.target.value as Exclude<ShapeCategory, '전체'>
                  )
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-zinc-900 text-xs bg-white"
              >
                <option value="동물">동물</option>
                <option value="하트·심볼">하트·심볼</option>
                <option value="해양생물">해양생물</option>
                <option value="캐릭터·기타">캐릭터·기타</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                지역 권역
              </label>
              <select
                value={region}
                onChange={(e) =>
                  setRegion(e.target.value as Exclude<RegionCategory, '전체'>)
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-zinc-900 text-xs bg-white"
              >
                <option value="서울">서울</option>
                <option value="대전·충청">대전·충청</option>
                <option value="부산·경남">부산·경남</option>
                <option value="제주·기타">제주·기타</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                상세 동네/공원명
              </label>
              <input
                type="text"
                placeholder="예: 마포구 연남동"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-zinc-900 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                출발 위치 안내
              </label>
              <input
                type="text"
                placeholder="예: 홍대입구역 3번 출구"
                value={startPointName}
                onChange={(e) => setStartPointName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-zinc-900 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                난이도
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-zinc-900 text-xs bg-white"
              >
                <option value="쉬움">쉬움</option>
                <option value="보통">보통</option>
                <option value="도전">도전</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              코스 설명 & 팁
            </label>
            <textarea
              rows={2}
              placeholder="어느 골목에서 귀 모양이 살아나는지, 신호등이나 노면 상태는 어떤지 적어주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-zinc-900 text-xs resize-none"
            />
          </div>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-zinc-200 font-semibold text-xs text-zinc-600 hover:bg-zinc-50 cursor-pointer"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>갤러리에 코스 등록하기</span>
          </button>
        </div>
      </form>
    </div>
  );
};
