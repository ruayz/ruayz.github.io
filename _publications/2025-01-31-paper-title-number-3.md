<!--
---
title: "On the Fairness of Privacy Protection: Measuring and Mitigating the Disparity of Group Privacy Risk for Differentially Private Machine Learning"
collection: publications
category: conferences
permalink: /publication/2025-01-31-paper-title-number-3
excerpt: 'While privacy-aware and fair ML has advanced, the fairness of privacy protection remains underexplored. Compared to others, I defined a membership inference game to efficiently audit worst-case individual privacy risks, providing a more precise assessment of group privacy disparities. Furthermore, to address these disparities in DP-SGD, I developed a group-specific adaptive gradient clipping strategy, which reduces privacy risk imbalances while preserving DP guarantees, fostering the equitable deployment of AI systems.'
paperurl: 'http://ruayz.github.io/files/paper_icml.pdf'
---

Abstract: Although research on privacy and fairness in machine learning (ML) has made significant progress, the fairness of privacy protection across different subgroups remains underexplored. Experimental results show that existing ML and differentially private machine learning (DPML) algorithms exhibit unfair privacy leakage risks among various groups, highlighting the need for further research in this area. Current studies primarily assess the average-case privacy risk of individual data records, which can overestimate protections for certain data points and underestimate disparities between groups. To address this, we introduce a membership inference game that efficiently audits the worst-case privacy risk associated with individual data points, allowing for more effective measurement of unfairness by evaluating privacy risk parity across groups. Based on our assessment of group privacy risk parity, we propose a novel technique to mitigate inequities in privacy protection for DPML. Inspired by canaries in differential privacy auditing, we enhance existing DPML algorithms with an adaptive group-specific gradient clipping strategy. Extensive experiments demonstrate that our approach maintains the same privacy guarantees as traditional DPML algorithms while effectively reducing disparities in group privacy risks, and promoting the ethical and equitable deployment of AI systems.
-->
