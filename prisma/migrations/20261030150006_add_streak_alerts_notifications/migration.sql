-- CreateTable
CREATE TABLE "streaks" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 0,
    "longest" INTEGER NOT NULL DEFAULT 0,
    "last_active_at" TIMESTAMP(3),
    "joker_used_at" TIMESTAMP(3),

    CONSTRAINT "streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_notifications" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,

    CONSTRAINT "daily_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutor_alerts" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tutor_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "streaks_tenant_id_student_id_key" ON "streaks"("tenant_id", "student_id");

-- CreateIndex
CREATE INDEX "daily_notifications_tenant_id_student_id_sent_at_idx" ON "daily_notifications"("tenant_id", "student_id", "sent_at");

-- CreateIndex
CREATE INDEX "tutor_alerts_tenant_id_priority_resolved_idx" ON "tutor_alerts"("tenant_id", "priority", "resolved");
