-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_goalId_fkey";

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
