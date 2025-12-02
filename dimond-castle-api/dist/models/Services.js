"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ServicesItemSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    labelEN: { type: String, required: true },
    labelAR: { type: String, required: true },
    imagePublicId: { type: String, required: false },
}, { _id: false });
const ServicesSchema = new mongoose_1.Schema({
    headingEN: { type: String, default: 'Services' },
    headingAR: { type: String, default: 'الخدمات' },
    sectorsTitleEN: { type: String, default: 'Sectors we serve' },
    sectorsTitleAR: { type: String, default: 'القطاعات التي نخدمها' },
    transportTitleEN: { type: String, default: 'Transport solutions' },
    transportTitleAR: { type: String, default: 'حلول النقل' },
    sectors: {
        type: [ServicesItemSchema],
        default: [
            {
                id: 'key',
                labelEN: 'Key Accounts sector',
                labelAR: 'قطاع الحسابات الرئيسية',
            },
            {
                id: 'retail',
                labelEN: 'Retail and supermarket sectors',
                labelAR: 'قطاع التجزئة والسوبرماركت',
            },
            {
                id: 'restaurants',
                labelEN: 'Restaurants and Kitchens',
                labelAR: 'المطاعم والمطابخ',
            },
            {
                id: 'catering',
                labelEN: 'Catering and food supply',
                labelAR: 'التموين وتوريد الأغذية',
            },
        ],
    },
    transport: {
        type: [ServicesItemSchema],
        default: [
            {
                id: 't10',
                labelEN: '10-ton Trucks',
                labelAR: 'شاحنات 10 طن',
            },
            {
                id: 't6',
                labelEN: '6-ton Trucks',
                labelAR: 'شاحنات 6 طن',
            },
            {
                id: 'mech',
                labelEN: 'Mechanizer Vehicles',
                labelAR: 'مركبات ميكانيزر',
            },
            {
                id: 'sales',
                labelEN: 'Salesmen Vehicles',
                labelAR: 'مركبات المندوبين',
            },
        ],
    },
}, { timestamps: true });
exports.default = mongoose_1.models.Services || (0, mongoose_1.model)('Services', ServicesSchema);
