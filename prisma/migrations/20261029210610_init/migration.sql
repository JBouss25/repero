-- CreateEnum
CREATE TYPE "bloom_level" AS ENUM ('remember', 'understand', 'apply', 'analyze', 'evaluate');

-- CreateEnum
CREATE TYPE "curriculum" AS ENUM ('marocain', 'francais', 'commun');

-- CreateEnum
CREATE TYPE "item_format" AS ENUM ('qcm', 'numeric', 'true_false', 'guided', 'graph');

-- CreateEnum
CREATE TYPE "phase" AS ENUM ('warmup', 'core', 'self_eval', 'challenge');

-- CreateEnum
CREATE TYPE "validation_step" AS ENUM ('redaction', 'peer_review', 'test_30');

-- CreateEnum
CREATE TYPE "confidence" AS ENUM ('sure', 'hesitant', 'random');

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "competence_id" TEXT NOT NULL,
    "chapter" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "bloom" "bloom_level" NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "curriculum" "curriculum" NOT NULL,
    "target_time_s" INTEGER NOT NULL,
    "format" "item_format" NOT NULL,
    "phases" "phase"[],
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distractors" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "error_type" TEXT NOT NULL,

    CONSTRAINT "distractors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validations" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "step" "validation_step" NOT NULL,
    "reviewer_id" TEXT,
    "passed_at" TIMESTAMP(3),

    CONSTRAINT "validations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_states" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "last_review_at" TIMESTAMP(3) NOT NULL,
    "due_at" TIMESTAMP(3) NOT NULL,
    "stability_days" DOUBLE PRECISION NOT NULL,
    "reps" INTEGER NOT NULL DEFAULT 0,
    "lapses" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "review_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mastery" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "competence_id" TEXT NOT NULL,
    "p_mastery" DOUBLE PRECISION NOT NULL,
    "slip" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "guess" DOUBLE PRECISION NOT NULL DEFAULT 0.25,
    "transit" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "mastered" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mastery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responses" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "time_ms" INTEGER NOT NULL,
    "target_time_ms" INTEGER NOT NULL,
    "hints_used" INTEGER NOT NULL,
    "confidence" "confidence" NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_logs" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "composed_at" TIMESTAMP(3) NOT NULL,
    "item_ids" TEXT[],

    CONSTRAINT "session_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_logs" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "rule" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "decision_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_dates" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "chapter" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "exam_dates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "items_tenant_id_competence_id_idx" ON "items"("tenant_id", "competence_id");

-- CreateIndex
CREATE INDEX "items_tenant_id_chapter_level_idx" ON "items"("tenant_id", "chapter", "level");

-- CreateIndex
CREATE INDEX "review_states_tenant_id_student_id_due_at_idx" ON "review_states"("tenant_id", "student_id", "due_at");

-- CreateIndex
CREATE UNIQUE INDEX "review_states_tenant_id_student_id_item_id_key" ON "review_states"("tenant_id", "student_id", "item_id");

-- CreateIndex
CREATE INDEX "mastery_tenant_id_student_id_mastered_idx" ON "mastery"("tenant_id", "student_id", "mastered");

-- CreateIndex
CREATE UNIQUE INDEX "mastery_tenant_id_student_id_competence_id_key" ON "mastery"("tenant_id", "student_id", "competence_id");

-- CreateIndex
CREATE INDEX "responses_tenant_id_student_id_at_idx" ON "responses"("tenant_id", "student_id", "at");

-- CreateIndex
CREATE INDEX "responses_tenant_id_item_id_idx" ON "responses"("tenant_id", "item_id");

-- CreateIndex
CREATE INDEX "session_logs_tenant_id_student_id_composed_at_idx" ON "session_logs"("tenant_id", "student_id", "composed_at");

-- CreateIndex
CREATE INDEX "decision_logs_session_id_idx" ON "decision_logs"("session_id");

-- CreateIndex
CREATE INDEX "exam_dates_tenant_id_student_id_at_idx" ON "exam_dates"("tenant_id", "student_id", "at");

-- AddForeignKey
ALTER TABLE "distractors" ADD CONSTRAINT "distractors_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validations" ADD CONSTRAINT "validations_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_states" ADD CONSTRAINT "review_states_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_logs" ADD CONSTRAINT "decision_logs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
