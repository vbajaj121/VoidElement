-- DropIndex
DROP INDEX "Order_stripePaymentIntentId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "stripePaymentIntentId",
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_razorpayOrderId_key" ON "Order"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_razorpayPaymentId_key" ON "Order"("razorpayPaymentId");
