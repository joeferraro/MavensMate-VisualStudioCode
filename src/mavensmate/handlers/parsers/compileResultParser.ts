export function getFailuresFromDetails(result){
    let failures = [];
    let componentFailures = result.details.componentFailures;
    if(componentFailures){
        if(componentFailures instanceof Array){
            processFailuresAsArray(failures, componentFailures);
        } else {
            failures.push(componentFailures);
        }
    }
    return failures;
}

function processFailuresAsArray(failures, componentFailures){
    for(let componentFailure of componentFailures){
        if(componentFailure.DeployDetails){
            pushDeploymentDetailFailures(failures, componentFailure.DeployDetails);
        } else {
            failures.push(componentFailure);
        }
    }
}

function pushDeploymentDetailFailures(failures, deployDetails){
    for(let failure of deployDetails.componentFailures){
        failures.push(failure);
    }
}

export function getSuccessesFromDetails(result){
    let successes = [];
    let componentSuccesses = result.details.componentSuccesses;
    if(componentSuccesses){
        if(componentSuccesses instanceof Array){
            processSuccessesAsArray(successes, componentSuccesses);
        } else {
            successes.push(componentSuccesses);
        }
    }
    return successes;
}

function processSuccessesAsArray(successes, componentSuccesses){
    for(let componentSuccess of componentSuccesses){
        if(componentSuccess.DeployDetails){
            pushDeploymentDetailSucesses(successes, componentSuccess.DeployDetails);
        } else {
            successes.push(componentSuccess);
        }
    }
}

function pushDeploymentDetailSucesses(successes, deployDetails){
    for(let failure of deployDetails.componentSuccesses){
        successes.push(failure);
    }
}