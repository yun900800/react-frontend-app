import React from "react";
import ResponsiveFlow from "../../../shared/components/layout/ResponsiveFlow";
import ToggleBox from "../components/ToggleBox";
import MultiStateButton from "../components/MultiStateButton";
import SequentialButton, { SequentialButtonEvent, SequentialButtonKeyframes} from "../components/SequentialButton";
import { ModalController } from "../components/ModalController";
import { StaggeredList } from "../components/StaggeredList";
import { ExpandedList } from "../components/ExpandedList";
const AnimationPage = () => {
    return (
        <ResponsiveFlow>
            <ToggleBox />
            <MultiStateButton />
            <SequentialButton />
            <SequentialButtonEvent />
            <SequentialButtonKeyframes />
            <ModalController />
            <StaggeredList />
            <ExpandedList />
        </ResponsiveFlow>
    );
};
export default AnimationPage;