
const VALID_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const validateOrderStatus = (req, res, next) => {
  const { status } = req.body ?? {};

  if (typeof status !== "string" || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "El estado del pedido no es válido",
      allowedStatuses: VALID_STATUSES,
    });
  }

  next();
};

export default validateOrderStatus;
