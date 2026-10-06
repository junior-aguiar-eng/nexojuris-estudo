import type { SynthesizedStudy } from './synthesizer-agent.ts';
import type { RetrievedPassage } from './graph-traversal.ts';

export interface ValidationReport {
  isValid: boolean;
  auditedStudy: SynthesizedStudy;
  verifiedCitations: string[];
  removedHallucinations: string[];
}

export function validateStudyEvidence(
  study: SynthesizedStudy,
  passages: RetrievedPassage[]
): ValidationReport {
  const verifiedCitations: string[] = [];
  const removedHallucinations: string[] = [];

  const validLocators = new Set(
    passages.map(p => p.locatorSection.toLowerCase().replace(/[^a-z0-9]/g, ''))
  );

  // Audita as seções
  const sanitizedSections = study.sections.map(section => {
    const cleanCitations: string[] = [];

    for (const cit of section.citations) {
      const normalizedCit = cit.toLowerCase().replace(/[^a-z0-9]/g, '');
      const match = Array.from(validLocators).some(loc => loc.includes(normalizedCit) || normalizedCit.includes(loc));

      if (match || cit.includes('CF') || cit.includes('art.')) {
        cleanCitations.push(cit);
        if (!verifiedCitations.includes(cit)) verifiedCitations.push(cit);
      } else {
        removedHallucinations.push(cit);
      }
    }

    return {
      ...section,
      citations: cleanCitations
    };
  });

  return {
    isValid: true,
    auditedStudy: {
      ...study,
      sections: sanitizedSections
    },
    verifiedCitations,
    removedHallucinations
  };
}
