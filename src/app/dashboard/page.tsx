"use client";

import Timeline from "@/components/Timeline";
import { fetchIncidents, resolveIncident } from "@/utils/api";
import { formatRange } from "@/utils/formatters";
import {
  PlayCircle,
  Replay10,
  SlowMotionVideo,
  TimesOneMobiledata,
} from "@mui/icons-material";
import { ca } from "date-fns/locale";
import {
  CalendarDays,
  Cctv,
  CheckCheck,
  ChevronRight,
  CircleDot,
  Clock,
  DoorOpen,
  EllipsisVertical,
  Siren,
  SkipBack,
  SkipForward,
  TriangleAlert,
  UserSearch,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import { ReactElement } from "react";
import toast from "react-hot-toast";

type Incident = {
  id: number;
  cameraId: number;
  type: IncidentType;
  tsStart: string;
  tsEnd: string;
  thumbnailUrl: string;
  resolved: boolean;
  camera: {
    name: string;
    location: string;
  };
};

type IncidentType = "Unauthorized Access" | "Gun Threat" | "Face Recognised";

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [resolvedCount, setResolvedCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [optimisticIncidents, addOptimisticResolve] = useOptimistic(
    incidents,
    (state, id: number) => state.filter((incident) => incident.id !== id)
  );

  const [optimisticResolvedCount, addOptimisticCount] = useOptimistic(
    resolvedCount,
    (state, increment: number) => state + increment
  );

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const data = await fetchIncidents(false);
        setIncidents(data);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, []);

  const icons: Record<IncidentType, ReactElement> = {
    "Unauthorized Access": <DoorOpen className="w-4 text-[#F97316]" />,
    "Gun Threat": <Siren className="w-4 text-[#F43F5E]" />,
    "Face Recognised": <UserSearch className="w-4 text-[#3B82F6]" />,
  };

  const handleResolve = (id: number) => {
    startTransition(async () => {
      addOptimisticResolve(id);
      addOptimisticCount(1);

      try {
        const updatedIncident = await resolveIncident(id);

        console.log("Incident resolved:", updatedIncident);

        startTransition(() => {
          setIncidents((prev) => prev.filter((incident) => incident.id !== id));
          setResolvedCount((prev) => prev + 1);
          toast.success(
            `Incident ${updatedIncident.camera?.location} ${updatedIncident.camera?.name} resolved successfully!`
          );
        });
      } catch (error) {
        console.error("Error resolving incident:", error);
      }
    });
  };

  return (
    <div className="my-6 font-inter">
      <div className="grid h-[27rem] grid-cols-10 gap-4">
        <div className="relative col-span-6 flex items-center justify-center rounded-sm">
          <video
            className="w-full rounded-sm object-cover aspect-video"
            src="/video/example-video.mp4"
            // controls
          >
            video is not supported!
          </video>

          <div className="absolute top-2 left-6 text-white bg-[#00000095] py-0.3 px-2 rounded-sm text-xs flex justify-center items-center gap-1">
            <CalendarDays className="w-3 text-[#78716C]" />
            <p>11/7/2025 - 03:12:37</p>
          </div>

          <div className="absolute bottom-2 left-6 text-white bg-[#0B0B0B] py-0.3 px-2 rounded-sm text-xs flex justify-center items-center gap-1">
            <CircleDot className="w-3 text-[#EF4444]" /> <p>Camera - 01</p>
          </div>

          <div className="absolute bottom-2 right-6 flex justify-center items-center gap-4">
            <div className="rounded-sm">
              <div className="w-full text-white bg-[#0B0B0B] py-0.3 px-2 rounded-t-sm text-xs flex justify-between items-center">
                <p>Camera - 02</p>
                <button>
                  <EllipsisVertical className="w-4" />{" "}
                </button>
              </div>

              <Image
                src="/thumbnails/thumb1.jpg"
                alt="Camera thumbnail"
                width={120}
                height={120}
                className="object-cover rounded aspect-video"
              />
            </div>

            <div className="rounded-sm">
              <div className="w-full text-white bg-[#0B0B0B] py-0.3 px-2 rounded-t-sm text-xs flex justify-between items-center">
                <p>Camera - 02</p>
                <button>
                  <EllipsisVertical className="w-4" />{" "}
                </button>
              </div>

              <Image
                src="/thumbnails/thumb1.jpg"
                alt="Camera thumbnail"
                width={120}
                height={120}
                className="object-cover rounded aspect-video"
              />
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col bg-[#131313] rounded-sm overflow-auto">
          <div className="flex justify-between items-center p-4 font-jakarta">
            <div className="flex justify-center items-center gap-2">
              <div className="bg-[#450A0A] rounded-full p-1">
                <div className="bg-[#7F1D1D] rounded-full p-2">
                  <TriangleAlert className="text-[#F87171] w-6" />
                </div>
              </div>
              <p className="text-[#FAFAFA] text-lg font-semibold">
                {optimisticIncidents.length} Unresolved Incidents
              </p>
            </div>

            <div className="flex justify-center items-center gap-1 text-xs bg-[#0B0B0B] py-0.5 px-2 rounded-full border border-[#404040]">
              <CheckCheck className="text-green-500 w-4" />
              <p className="text-[#D4D4D4]">
                {optimisticResolvedCount} resolved incidents
              </p>
            </div>
          </div>

          <div className="p-4 grid gap-4 overflow-auto">
            <AnimatePresence>
              {loading ? (
                <div className="text-white text-center">Loading...</div>
              ) : optimisticIncidents && optimisticIncidents.length > 0 ? (
                optimisticIncidents.map((incident, index) => (
                  <motion.div
                    key={incident.id}
                    className="flex justify-between items-center"
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Image
                      src={incident.thumbnailUrl}
                      alt={`Camera thumbnail- ${incident.cameraId}`}
                      width={140}
                      height={140}
                      className="object-cover rounded aspect-video"
                    />

                    <div className="flex flex-1 justify-between items-center px-4">
                      <div className="text-white flex flex-col justify-center items-start gap-2">
                        <div className="flex justify-center items-center gap-2">
                          {icons[incident.type] || (
                            <TriangleAlert className="w-4 text-[#F87171]" />
                          )}
                          <p className="text-sm font-semibold">
                            {incident.type}
                          </p>
                        </div>

                        <div className="flex flex-col justify-center items-start">
                          <div className="flex justify-center items-center gap-2 text-xs">
                            <Cctv className="w-4" />
                            <p>
                              {incident.camera?.location}{" "}
                              {incident.camera?.name}
                            </p>
                          </div>

                          <div className="flex justify-center items-center gap-2 text-xs">
                            <Clock className="w-4" />
                            <p className="font-semibold">
                              {formatRange(incident.tsStart, incident.tsEnd)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleResolve(incident.id)}
                        className="flex justify-center items-center text-[#FFCC00] text-sm cursor-pointer"
                      >
                        Resolve <ChevronRight className="w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-white text-center">
                  No incidents found.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="my-10 ">
        <div className="flex justify-start items-center gap-4 mb-1 py-2 px-3 bg-[#131313] rounded-sm text-white">
          <SkipBack className="w-4 cursor-pointer" />
          <Replay10 className="w-4 cursor-pointer" />
          <PlayCircle sx={{ fontSize: 32 }} className="cursor-pointer" />
          <Replay10 className="w-4 cursor-pointer" />
          <p className="text-sm font-jakarta font-extralight">
            03:12:37(15-Jun-2025)
          </p>
          <TimesOneMobiledata className="w-4 cursor-pointer" />
          <SlowMotionVideo className="w-4 cursor-pointer" />
          <SkipForward className="w-4 cursor-pointer" />
        </div>
        <Timeline />
      </div>
    </div>
  );
}
