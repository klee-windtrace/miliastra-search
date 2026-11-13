// An `all` report holds the payload of several modes; this cuts out the report of one of them, exactly as a run of that mode alone would have
// made it: the header names the mode and keeps only the options that mode has.
import { MODE_OPTIONS } from './options.mjs';

/** The single-mode report of `mode` inside an `all` report (a report of any other mode is returned as it is when it is of `mode`). */
export function partOf(report, mode) {
  if (report.header.mode === mode) return report;
  const options = Object.fromEntries(MODE_OPTIONS[mode].map((k) => [k, report.header.options[k]]));
  return { header: { ...report.header, mode, options }, [mode]: report[mode] };
}
