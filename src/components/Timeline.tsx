import { fetchCameras } from "@/utils/api";
import {
  getIncidentDuration,
  minutesToTime,
  minutesToTimeWithSeconds,
  timeToMinutes,
  timeToSeconds,
} from "@/utils/formatters";
import { Cctv } from "lucide-react";
import { g } from "motion/react-client";
import React, { useRef, useState, useEffect } from "react";

const minutesInDay = 1440; // 24 hours * 60 minutes
const majorTickInterval = 10; // Major tick every 10 minutes
const totalMajorTicks = 144; // 6 * 24 = 144 major ticks
const scale = 5; // Scale factor to increase spacing

const leftPanelWidth = 140; // Width reserved for camera names on left
const cameraRowHeight = 35; // Height per camera row
const incidentBarHeight = 30; // Height of each incident bar

type IncidentType = "Unauthorized Access" | "Gun Threat" | "Face Recognised";

interface Incident {
  id: string;
  tsStart: string; // ISO datetime string
  tsEnd: string; // ISO datetime string
  type: IncidentType;
}

interface Camera {
  cameraId: string;
  cameraName: string;
  location: string;
  incidents: Incident[];
}

// Type for the complete array
type IncidentsData = Camera[];

export default function Timeline() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [scrubberX, setScrubberX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const [incidentsData, setIncidentsData] = useState<IncidentsData>([]);

  useEffect(() => {
    fetchCameras().then((data) => setIncidentsData(data));
  }, []);

  const handleMouseDown = () => setDragging(true);

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !svgRef.current) return;
    const bounds = svgRef.current.getBoundingClientRect();
    let x = (e.clientX - bounds.left - leftPanelWidth) / scale;
    x = Math.max(0, Math.min(x, minutesInDay));

    // Convert current drag position (in minutes) to seconds
    const dragSeconds = x * 60;
    let snapSeconds: number | null = null;

    const SNAP_THRESHOLD = 120; // seconds

    // Check start and end of each incident
    incidentsData.forEach((camera) => {
      camera.incidents.forEach((incident: Incident) => {
        const startSec = timeToSeconds(incident.tsStart);
        const endSec = timeToSeconds(incident.tsEnd);
        if (Math.abs(dragSeconds - startSec) <= SNAP_THRESHOLD) {
          snapSeconds = startSec;
        }
        if (Math.abs(dragSeconds - endSec) <= SNAP_THRESHOLD) {
          snapSeconds = endSec;
        }
      });
    });

    // Snap if within threshold, else use actual drag
    if (snapSeconds !== null) {
      setScrubberX(snapSeconds / 60);
    } else {
      setScrubberX(x);
    }
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const getIncidentColor = (type: IncidentType) => {
    switch (type) {
      case "Unauthorized Access":
        return "#431407";
      case "Gun Threat":
        return "#450A0A";
      case "Face Recognised":
        return "#172554";
      default:
        return "#6B7280";
    }
  };

  const getIncidentIcon = (type: IncidentType) => {
    switch (type) {
      case "Unauthorized Access":
        return "/icons/door.svg";
      case "Gun Threat":
        return "/icons/alert.svg";
      case "Face Recognised":
        return "/icons/people.svg";
      default:
        return "/icons/unknown.svg";
    }
  };

  const timelineHeight = incidentsData.length * cameraRowHeight + 55; // total height

  console.log("Incident Data:", incidentsData);
  return (
    <div
      className="overflow-x-scroll bg-[#131313] py-2 font-jakarta rounded-sm"
      style={{ fontFamily: "sans-serif" }}
    >
      <svg
        ref={svgRef}
        width={minutesInDay * scale + leftPanelWidth + 20}
        height={timelineHeight}
      >
        {/* Camera List Heading */}
        <g>
          <text
            x={10}
            y={37}
            fontSize={20}
            fill="#fff"
            textAnchor="start"
            dominantBaseline="middle"
          >
            Camera List
          </text>
        </g>

        {/* Left panel with camera names */}
        {incidentsData.map((camera, i) => {
          const y = i * cameraRowHeight + 60;
          return (
            <g key={camera.cameraId}>
              <rect
                key={`row-bg-${camera.cameraId}`}
                x={0}
                y={y}
                width="100%"
                height={incidentBarHeight}
                fill={"#232323"} // Background color for camera row
                rx={4}
              />

              {/* SVG Icon from public folder */}
              <image
                href="/icons/camera.svg" // Place your SVG in public/icons/camera.svg
                x={15}
                y={y + incidentBarHeight / 2 - 8}
                width={16}
                height={16}
              />

              <text
                key={camera.cameraId}
                x={35}
                y={y + incidentBarHeight / 2}
                fontSize={14}
                fill="#fff"
                dominantBaseline="middle"
              >
                {camera.cameraName}
              </text>
            </g>
          );
        })}

        {/* Timeline major ticks */}
        {Array.from({ length: totalMajorTicks }, (_, i) => {
          const minutes = i * majorTickInterval;
          const x = minutes * scale + leftPanelWidth;
          return (
            <g key={i}>
              <line x1={x} y1={45} x2={x} y2={55} stroke="#ccc" />
              <text
                x={x}
                y={40}
                fontSize={10}
                fill="#fff"
                textAnchor="start"
                pointerEvents="none"
              >
                {minutesToTime(minutes)}
              </text>
            </g>
          );
        })}

        {/* Minor ticks between the major ticks (every minute) */}
        {Array.from({ length: totalMajorTicks }, (_, i) => {
          const baseMinutes = i * majorTickInterval;
          // Skip last major tick as no ticks after 24:00
          if (baseMinutes >= minutesInDay) return null;

          return Array.from({ length: 9 }, (_, j) => {
            const minorMinutes = baseMinutes + j + 1;
            const x = minorMinutes * scale + leftPanelWidth;
            return (
              <line
                key={`minor-${i}-${j}`}
                x1={x}
                y1={50}
                x2={x}
                y2={55}
                stroke="#ddd"
                strokeWidth={1}
              />
            );
          });
        })}

        {/* Incident Bars per camera */}
        {incidentsData.map((camera, i) => {
          const y = i * cameraRowHeight + 60;

          return camera.incidents.map((incident: Incident) => {
            const startMinutes = timeToMinutes(incident.tsStart);
            const endMinutes = timeToMinutes(incident.tsEnd);
            const duration = endMinutes - startMinutes;
            const x = startMinutes * scale + leftPanelWidth;
            const width = Math.max(duration * scale);

            console.log(
              "Incident:",
              incident,
              "X:",
              x,
              "Width:",
              width,
              "startMinutes:",
              startMinutes,
              "endMinutes:",
              endMinutes
            );

            return (
              <g key={incident.id}>
                {/* Incident Bar Background */}
                <rect
                  x={x}
                  y={y + 5}
                  width={width}
                  height={incidentBarHeight - 10}
                  fill={getIncidentColor(incident.type)}
                  stroke={getIncidentColor(incident.type)}
                  strokeWidth={0.5}
                  rx={4}
                  ry={4}
                />

                {/* Icon in the center of the bar */}
                <image
                  href={getIncidentIcon(incident.type)}
                  x={x + width / 2 - 8} // Center the 16px icon
                  y={y + incidentBarHeight / 2 - 8}
                  width={16}
                  height={16}
                />

                {/* Invisible hover area for tooltip */}
                <rect
                  x={x}
                  y={y + 5}
                  width={width}
                  height={incidentBarHeight - 10}
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                >
                  <title>{incident.type}</title> {/* Native SVG tooltip */}
                </rect>
              </g>
            );
          });
        })}

        {/* Scrubber Line with moving time display */}
        <g onMouseDown={handleMouseDown} style={{ cursor: "pointer" }}>
          {/* Scrubber Line */}
          <line
            x1={scrubberX * scale + leftPanelWidth}
            y1={20}
            x2={scrubberX * scale + leftPanelWidth}
            y2={timelineHeight}
            stroke="#FFCC00"
            strokeWidth={2}
          />

          {/* Moving time display on top of scrubber */}
          <g>
            {/* Background for time text */}
            <rect
              x={scrubberX * scale + leftPanelWidth - 35}
              y={1}
              width={70}
              height={20}
              fill="#FFCC00"
              rx={12}
            />
            {/* Triangle pointer with smooth curved sides */}
            <path
              d={`M ${scrubberX * scale + leftPanelWidth - 6} 21 
                  C ${scrubberX * scale + leftPanelWidth - 3} 21, 
                    ${scrubberX * scale + leftPanelWidth - 2} 24, 
                    ${scrubberX * scale + leftPanelWidth} 26 
                  C ${scrubberX * scale + leftPanelWidth + 2} 24, 
                    ${scrubberX * scale + leftPanelWidth + 3} 21, 
                    ${scrubberX * scale + leftPanelWidth + 6} 21 
                  Z`}
              fill="#FFCC00"
              stroke="#FFCC00"
            />

            {/* Time text */}
            <text
              x={scrubberX * scale + leftPanelWidth}
              y={12}
              fontSize={10}
              fill="#000"
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="bold"
              pointerEvents="none"
            >
              {minutesToTimeWithSeconds(scrubberX)}s
            </text>
          </g>
        </g>

        {/* Final tick at 24:00 */}
        <g>
          <line
            x1={minutesInDay * scale + leftPanelWidth}
            y1={45}
            x2={minutesInDay * scale + leftPanelWidth}
            y2={55}
            stroke="#ccc"
          />
          <text
            x={minutesInDay * scale + leftPanelWidth}
            y={40}
            fontSize={10}
            fill="#fff"
            textAnchor="middle"
          >
            24:00
          </text>
        </g>
      </svg>
    </div>
  );
}
