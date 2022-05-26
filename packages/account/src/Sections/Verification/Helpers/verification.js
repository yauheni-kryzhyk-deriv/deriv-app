export const populateVerificationStatus = account_status => {
    // need add verification for poinc statuses, need to know fileds name in BE response

    const { attempts, document, identity, needs_verification, proof_of_income } = account_status.authentication;
    const has_poa = !(document && document.status === 'none');
    const has_poi = !(identity && identity.status === 'none');
    const has_poinc = !(proof_of_income && proof_of_income.status === 'none');
    const needs_poa = needs_verification.length && needs_verification.includes('document');
    const needs_poi = needs_verification.length && needs_verification.includes('identity');
    const needs_poinc = needs_verification.length && needs_verification.includes('proof_of_income');

    const allow_document_upload = account_status.status.some(status => status === 'allow_document_upload');
    const allow_poi_resubmission = account_status.status.some(status => status === 'allow_poi_resubmission');
    const allow_poa_resubmission = account_status.status.some(status => status === 'allow_poa_resubmission');
    // const allow_poinc_resubmission = account_status.status.some(status => status === 'allow_poinc_resubmission'); ask to BE if it will be implemented
    const is_age_verified = account_status.status.some(status => status === 'age_verification');
    const is_idv_disallowed = account_status.status.some(status => status === 'idv_disallowed');

    const identity_status = identity.status;
    const document_status = document.status;
    // const proof_of_income_status = proof_of_income.status;
    const proof_of_income_status = 'none'; /* temporary */

    const { idv, onfido, manual } = identity.services;
    const identity_last_attempt = attempts.latest;
    const has_attempted_idv = !!(attempts.history.length && attempts.history.find(h => h.service === 'idv'));

    return {
        allow_document_upload,
        allow_poa_resubmission,
        allow_poi_resubmission,
        // allow_poinc_resubmission,
        has_attempted_idv,
        has_poa,
        has_poi,
        has_poinc,
        identity_last_attempt,
        identity_status,
        document_status,
        proof_of_income_status,
        idv,
        is_age_verified,
        is_idv_disallowed,
        manual,
        needs_poa,
        needs_poi,
        needs_poinc,
        needs_verification,
        onfido,
    };
};
