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

import org.eclipse.edc.crawler.spi.TargetNode;
import org.eclipse.edc.crawler.spi.TargetNodeDirectory;

import java.util.List;

public class DemoTargetNodeDirectory implements TargetNodeDirectory {

    private static final String DSP_URL_PATTERN = "http://%s-connector:9194/protocol";

    private static final List<String> PARTICIPANT_LIST = List.of("consumer", "provider");

    @Override
    public List<TargetNode> getAll() {
        return PARTICIPANT_LIST.stream().map(this::toTargetNode).toList();
    }

    @Override
    public void insert(TargetNode targetNode) {
        throw new UnsupportedOperationException("Adding new participant is not supported");
    }

    private TargetNode toTargetNode(String id) {
        return new TargetNode(id, id, DSP_URL_PATTERN.formatted(id), List.of("dataspace-protocol-http"));
    }
}
