"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const profile = {
    id: "1",
    name: "Jane Doe",
    email: "jane@tenant.com",
    property: "Sunrise Apartments",
    unit: "5A",
    leaseStart: "2024-01-01",
    leaseEnd: "2024-12-31",
    monthlyRent: 1200,
    deposit: 1200,
    status: "Active",
};
function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).end();
    }
    res.status(200).json(profile);
}
//# sourceMappingURL=profile.js.map