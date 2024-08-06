/*
 *  Copyright (c) 2024 Amadeus
 *
 *  This program and the accompanying materials are made available under the
 *  terms of the Apache License, Version 2.0 which is available at
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 *  SPDX-License-Identifier: Apache-2.0
 *
 *  Contributors:
 *       Amadeus - initial API and implementation
 *
 */

package io.thinkit.client.extension;

import org.eclipse.edc.crawler.spi.TargetNodeDirectory;
import org.eclipse.edc.crawler.spi.TargetNodeFilter;
import org.eclipse.edc.runtime.metamodel.annotation.Extension;
import org.eclipse.edc.runtime.metamodel.annotation.Inject;
import org.eclipse.edc.runtime.metamodel.annotation.Provider;
import org.eclipse.edc.spi.monitor.Monitor;
import org.eclipse.edc.spi.system.ServiceExtension;
import org.eclipse.edc.spi.system.ServiceExtensionContext;

import static io.thinkit.client.extension.ParticipantsResolverExtension.NAME;

@Extension(value = NAME)
public class ParticipantsResolverExtension implements ServiceExtension {

    public static final String NAME = "Participant Resolver Extension";

    @Inject
    private Monitor monitor;

    @Override
    public String name() {
        return NAME;
    }

    @Provider
    public TargetNodeDirectory createLazyTargetNodeDirectory() {
        return new DemoTargetNodeDirectory();
    }

    @Provider
    public TargetNodeFilter skipSelfNodeFilter(ServiceExtensionContext context) {
        return targetNode -> {
            var predicateTest = !targetNode.id().equals(context.getParticipantId());
            if (!predicateTest) {
                monitor.debug("Node filter: skipping node '%s' for participant '%s'".formatted(targetNode.id(), context.getParticipantId()));
            }
            return predicateTest;
        };
    }

}
