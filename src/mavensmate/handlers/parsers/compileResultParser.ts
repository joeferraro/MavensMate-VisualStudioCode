export function getFailuresFromDetails(result){
    let failures = [];
    let componentFailures = result.details.componentFailures;
    if(componentFailures){
        if(componentFailures instanceof Array){
            processComponentsAsArray(failures, componentFailures, 'componentFailures');
        } else {
            failures.push(componentFailures);
        }
    }
    return failures;
}

function processComponentsAsArray(compileComponents, detailComponents, componentType){
    for(let detailComponent of detailComponents){
        if(detailComponent.DeployDetails){
            pushDeployDetailComponents(compileComponents, detailComponent.DeployDetails[componentType]);
        } else {
            compileComponents.push(detailComponent);
        }
    }
}

function pushDeployDetailComponents(compileComponents, deployDetailComponents){
    for(let deployDetailComponent of deployDetailComponents){
        compileComponents.push(deployDetailComponent);
    }
}

export function getSuccessesFromDetails(result){
    let successes = [];
    let componentSuccesses = result.details.componentSuccesses;
    if(componentSuccesses){
        if(componentSuccesses instanceof Array){
            processComponentsAsArray(successes, componentSuccesses, 'componentSuccesses');
        } else {
            successes.push(componentSuccesses);
        }
    }
    return successes;
}