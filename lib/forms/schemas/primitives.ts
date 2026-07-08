// Primitive Zod schemas used across all form sections.

import { z } from 'zod';

export const nonEmptyString = z.string().min(1, 'This field is required');
export const optionalString = z.string().optional().or(z.literal(''));
export const emailSchema = z.string().min(1, 'Email is required').email('Please enter a valid email address');
export const optionalEmail = z.string().email('Please enter a valid email address').optional().or(z.literal(''));
export const urlSchema = z.string().min(1, 'URL is required').refine(
  (val) => { try { new URL(val.startsWith('http') ? val : `https://${val}`); return true; } catch { return false; } },
  'Please enter a valid URL'
);
export const optionalUrl = z.string().refine(
  (val) => { if (!val) return true; try { new URL(val.startsWith('http') ? val : `https://${val}`); return true; } catch { return false; } },
  'Please enter a valid URL'
).optional().or(z.literal(''));
export const phoneSchema = z.string().optional().or(z.literal(''));

export const singleChoice = (options: string[], required: boolean) =>
  required
    ? z.string().min(1, 'Please select an option').refine((v) => options.includes(v) || v === 'Other', 'Invalid selection')
    : z.string().optional().or(z.literal(''));

export const multiSelect = (options: string[], required: boolean, maxSelections?: number) => {
  let schema = required
    ? z.array(z.string()).min(1, 'Please select at least one option')
    : z.array(z.string()).optional().default([]);

  if (maxSelections) {
    schema = schema.refine((arr) => !arr || arr.length <= maxSelections, {
      message: `Select no more than ${maxSelections} options`,
    });
  }
  return schema;
};

export const fileUpload = z.array(z.record(z.string(), z.unknown())).optional().default([]);
export const checkbox = z.boolean().refine((v) => v === true, 'You must agree to continue');

// Service repeater sub-schema
export const serviceItemSchema = z.object({
  service_name: z.string().min(1, 'Service name is required'),
  service_includes: z.string().min(1, 'Please describe what this service includes'),
  service_excludes: z.string().min(1, 'Please describe what this service excludes'),
  service_client_provides: z.string().min(1, 'Please describe what the client needs to provide'),
  service_timeline: z.string().min(1, 'Timeline is required'),
  service_outcome: z.string().min(1, 'Please describe the outcome'),
  service_starting_price: z.string().optional().or(z.literal('')),
});

export const servicesRepeatingSchema = z.array(serviceItemSchema).min(1, 'At least one service is required').max(5, 'No more than 5 services allowed');
